# EduMetrix — Full Backend Specification Prompt

> **Project name:** EduMetrix  
> **Purpose:** University CRM centred on a grant-rewarding system that tracks every dimension of a student's academic life, surfaces a ranked eligibility list to grant administrators, and drives AI-powered personalised recommendations via Gemini Flash.

---

## 0. Context & Guiding Principles

Build a **production-grade REST (or GraphQL) backend** for EduMetrix. The system is **not** a full LMS — it integrates with the university's existing LMS to pull grades and attendance via a student-ID-keyed API, then layers richer tracking on top. All data is time-scoped: every record must carry a semester/period reference so historical snapshots are preserved.

**Non-negotiable design constraints:**
- Role-based access control (RBAC) with fine-grained permission scopes
- Every write action is appended to an immutable audit log
- The grant scoring engine is a pluggable, configuration-driven formula — weights are editable by admins without code changes
- All file uploads (certificates, pitch decks, etc.) go to object storage (S3-compatible); only URLs are persisted in the DB
- AI features use Gemini Flash exclusively; prompts and responses are logged for auditing
- The system must support multiple active grant periods simultaneously (e.g. semester grant + annual scholarship)

**Tech stack suggestion (adapt as needed):**
- Language: Node.js (TypeScript) or Python (FastAPI)
- Database: PostgreSQL with row-level security
- Cache: Redis (sessions, leaderboard snapshots, rate-limiting)
- Queue: BullMQ or Celery (async jobs: LMS sync, AI calls, notifications)
- Storage: S3-compatible (MinIO for local dev)
- Auth: JWT + refresh tokens; SSO adapter (SAML/OAuth2) for university SSO
- Gemini Flash: `@google/generative-ai` SDK

---

## 1. User Roles & Permissions

Design a hierarchical RBAC system. Each role has a defined scope; a user can hold multiple roles simultaneously.

### 1.1 Role Definitions

| Role | Scope | Key abilities |
|---|---|---|
| `super_admin` | System-wide | Everything; manage roles, configure scoring weights |
| `grant_admin` | System-wide | View full student rankings; manage grant periods; approve/reject grant allocations; export reports |
| `department_admin` | Department | Manage mentors and students in their department; view department-level reports |
| `commandant` | Dormitory | Record and edit dormitory attendance only |
| `academic_admin` | Academic | Trigger LMS sync; manage academic calendar and groups |
| `mentor` (teacher) | Assigned students | Submit feedback on students; manage clubs they lead; approve/reject achievements; view mentee profiles |
| `club_mentor` | Club | Create club certifications; manage club membership; run teacher-student program within club |
| `student` | Own profile | Upload certificates; register for competitions; create/join startups; view own score breakdown; interact with AI recommendation assistant |

### 1.2 Permission Matrix
Generate a `permissions` table with scopes such as:
`read:any_student`, `read:own_profile`, `write:attendance_dormitory`, `write:attendance_class`, `write:feedback`, `manage:grant_periods`, `manage:clubs`, `view:grant_rankings`, `manage:scoring_weights`, `upload:certificates`, `manage:competitions`, `manage:startup`, `trigger:lms_sync`

Implement middleware that checks permissions on every route. Use attribute-based access control (ABAC) where the resource owner matters (e.g. a mentor can only write feedback for their assigned students).

---

## 2. Core Entities & Data Model

### 2.1 University Structure
```
University → Departments → Programs → Groups (cohorts)
Academic Calendar → Semesters → Months
```
- `universities`: id, name, lms_base_url, lms_api_key (encrypted)
- `departments`: id, university_id, name, head_user_id
- `programs`: id, department_id, name, duration_years
- `groups`: id, program_id, semester_id, name, year_of_study, mentor_id
- `semesters`: id, university_id, name, start_date, end_date, is_active
- `academic_months`: id, semester_id, month_number, start_date, end_date

### 2.2 Users & Profiles
- `users`: id, email, phone, password_hash, is_active, created_at, last_login
- `user_roles`: user_id, role, scope_type, scope_id (polymorphic)
- `student_profiles`: user_id, student_id (university ID), group_id, program_id, enrollment_date, dormitory_room, photo_url, bio, is_grant_eligible
- `mentor_profiles`: user_id, department_id, title, specialisations[]

### 2.3 Grant Scoring
```
GrantPeriod → ScoringConfig → CriteriaWeights
StudentScore → CriteriaScores → GrantDecision
```
- `grant_periods`: id, name, semester_id, start_date, end_date, budget, max_recipients, status (draft/active/closed/awarded)
- `scoring_configs`: id, grant_period_id, formula_version, criteria_weights (JSONB), min_score_threshold, tiebreaker_logic
- `criteria_weights` (JSONB structure):
  ```json
  {
    "grades": { "weight": 0.30, "sub": { "gpa": 0.7, "improvement_trend": 0.3 } },
    "attendance": { "weight": 0.15 },
    "achievements": { "weight": 0.15 },
    "competitions": { "weight": 0.10 },
    "feedback_score": { "weight": 0.10 },
    "club_activity": { "weight": 0.08 },
    "internship": { "weight": 0.07 },
    "startup": { "weight": 0.05 }
  }
  ```
- `student_grant_scores`: id, student_id, grant_period_id, total_score, rank, criteria_breakdown (JSONB), computed_at, snapshot_hash
- `grant_decisions`: id, grant_period_id, student_id, status (eligible/awarded/rejected/appealed/appeal_approved), decided_by, decision_note, decided_at
- `grant_appeals`: id, decision_id, student_id, reason, evidence_url, status, reviewed_by, reviewed_at, outcome_note

---

## 3. Module Specifications

---

### MODULE A — Grades

**Objective:** Pull grades from the university LMS per student ID, store time-granular snapshots, and expose aggregations used by the scoring engine.

#### 3.A.1 LMS Sync Service
- Scheduled job (configurable cron, default: nightly at 02:00)
- Endpoint: `POST /admin/lms-sync` (manual trigger, role: `academic_admin`)
- Per student, fetch: subjects enrolled, grade per subject per month, midterm grade, final exam grade
- Store raw LMS response in `lms_sync_logs` for debugging
- On conflict, update grade record and record delta in audit log

#### 3.A.2 Data Model
- `subjects`: id, code, name, department_id, credit_hours
- `subject_enrollments`: id, student_id, subject_id, semester_id, status
- `grade_records`: id, enrollment_id, grade_type (monthly/midterm/final/resit), month_id (nullable), numeric_grade, letter_grade, graded_at, lms_ref
- `semester_gpa`: id, student_id, semester_id, gpa, credit_hours_completed, computed_at

#### 3.A.3 API Endpoints
```
GET  /students/:id/grades                          — full grade history (auth: mentor, grant_admin, own student)
GET  /students/:id/grades/semester/:semesterId     — semester breakdown with monthly trend
GET  /students/:id/grades/subject/:subjectId       — per-subject timeline
GET  /students/:id/gpa/current                     — live GPA for scoring
POST /admin/lms-sync                               — trigger manual sync
GET  /admin/lms-sync/logs                          — sync history & errors
```

#### 3.A.4 Scoring Contribution
- Base GPA normalised to 0–100
- Improvement trend: compare current semester GPA to previous semester (+bonus if rising, -penalty if sharp decline)
- Subject-level red flags surfaced to the recommendation engine (subjects below passing threshold → trigger recommendation event)

---

### MODULE B — Attendance

**Objective:** Track two distinct attendance streams — academic (class attendance, sourced from LMS) and dormitory (recorded manually by commandants).

#### 3.B.1 Academic Attendance
- Pulled from LMS during nightly sync alongside grades
- `class_attendance_records`: id, student_id, subject_id, class_date, status (present/absent/excused/late), lms_ref
- Aggregate: `monthly_attendance_summary`: student_id, month_id, subject_id, total_classes, present_count, excused_count, attendance_rate

#### 3.B.2 Dormitory Attendance
- Commandants record daily check-in/check-out for dormitory residents
- `dormitory_attendance_records`: id, student_id, dormitory_id, date, time_in, time_out, status (present/absent/late_entry/approved_leave), recorded_by (commandant user_id), note
- `approved_leaves`: id, student_id, start_date, end_date, reason, approved_by, status
- Commandant can only edit records within a 48-hour correction window (after that, requires `academic_admin` override)

#### 3.B.3 API Endpoints
```
GET  /students/:id/attendance/academic             — class attendance history
GET  /students/:id/attendance/dormitory            — dormitory attendance history
POST /dormitory/:dormId/attendance                 — bulk daily entry (commandant only)
PUT  /dormitory/attendance/:recordId               — correction within 48h window
POST /students/:id/leaves                          — submit leave request
PUT  /leaves/:leaveId/approve                      — approve leave (mentor or dept_admin)
GET  /admin/attendance/report                      — department/group level attendance report
```

#### 3.B.4 Scoring Contribution
- Combined attendance rate (weighted: academic 70%, dormitory 30%) normalised to 0–100
- Consecutive unexcused absences flag student for mentor review and trigger recommendation event

---

### MODULE C — Achievements & Certificates

**Objective:** Allow students to upload evidence of external achievements; mentors and admins verify them; verified achievements contribute to the grant score.

#### 3.C.1 Achievement Categories
Define a configurable `achievement_categories` table:
- Academic (dean's list, olympiad, academic publication)
- Professional (certification, licence, professional award)
- Volunteering (community service, NGO involvement)
- Sport (national/regional/university level)
- Creative (art, music, design award)
- Leadership (student council, committee chair)
- Other

Each category has a `base_score` (configurable by `grant_admin`) and `verification_required` flag.

#### 3.C.2 Data Model
- `achievements`: id, student_id, category_id, title, description, issuer, issue_date, expiry_date (nullable), file_url, status (pending/verified/rejected), submitted_at
- `achievement_verifications`: id, achievement_id, reviewed_by, status, rejection_reason, reviewed_at
- `achievement_scores`: id, achievement_id, grant_period_id, awarded_points, scoring_notes

#### 3.C.3 Verification Workflow
1. Student uploads certificate (file size limit 10MB, types: PDF/JPG/PNG)
2. System generates a thumbnail and extracts metadata (date, issuer name via OCR — optional Gemini Vision call)
3. Assigned mentor receives notification and reviews within 7-day SLA
4. Mentor approves (with optional point override) or rejects (with mandatory reason)
5. Rejected achievements can be re-submitted with corrections

#### 3.C.4 API Endpoints
```
POST /achievements                                 — submit achievement + file upload
GET  /achievements?studentId=&status=              — list (filtered)
GET  /achievements/:id                             — detail with file URL (signed S3)
PUT  /achievements/:id/verify                      — mentor approve/reject
GET  /admin/achievements/pending                   — verification queue for mentors
DELETE /achievements/:id                           — student delete (only if pending)
```

---

### MODULE D — Feedback & Relationship Score

**Objective:** Capture structured qualitative ratings from mentors and admins on students' attitudes, helpfulness to the university, and relationship with department management. This replaces vague subjective judgement with a logged, reviewable signal.

#### 3.D.1 Feedback Types
- **Mentor feedback** — periodic (monthly/per-event) structured rating by the student's assigned mentor
- **Admin feedback** — triggered when an admin observes notable student behaviour (positive or negative)
- **Event feedback** — attached to a specific event, task, or project the student participated in
- **Peer teaching feedback** — from students who were taught by a teacher-student (see Club Module)

#### 3.D.2 Feedback Form Schema (configurable per type)
```json
{
  "dimensions": [
    { "key": "proactiveness", "label": "Initiative & proactiveness", "scale": 5 },
    { "key": "communication", "label": "Communication", "scale": 5 },
    { "key": "helpfulness", "label": "Helpfulness to department/university", "scale": 5 },
    { "key": "professionalism", "label": "Professional attitude", "scale": 5 },
    { "key": "reliability", "label": "Reliability & follow-through", "scale": 5 }
  ],
  "qualitative_comment": true,
  "visible_to_student": true
}
```

#### 3.D.3 Data Model
- `feedback_templates`: id, name, type, form_schema (JSONB), is_active
- `feedback_records`: id, template_id, student_id, given_by, related_entity_type (event/task/general/peer_teaching), related_entity_id, scores (JSONB), comment, is_anonymous, created_at
- `feedback_aggregates`: student_id, grant_period_id, avg_scores (JSONB), total_feedback_count, weighted_score, last_computed

Students can view their own feedback (non-anonymous). Negative feedback requires a mandatory comment and triggers a mentor notification.

#### 3.D.4 API Endpoints
```
POST /feedback                                     — submit feedback (mentor, admin, club_mentor)
GET  /students/:id/feedback                        — feedback history (own + mentor view)
GET  /students/:id/feedback/summary                — aggregated score for grant period
POST /admin/feedback-templates                     — create/update feedback form schema
PUT  /feedback/:id/dispute                         — student can flag feedback as inaccurate (goes to dept_admin)
```

---

### MODULE E — Competitions

**Objective:** Full lifecycle management of competitions — from creation and registration through results and ranking — with per-student participation history feeding the grant score.

#### 3.E.1 Competition Lifecycle
```
Draft → Published → Registration Open → Registration Closed → In Progress → Results Pending → Completed → Archived
```

#### 3.E.2 Data Model
- `competitions`: id, name, description, type (hackathon/olympiad/case_competition/sport/debate/other), level (university/regional/national/international), organiser, start_date, end_date, registration_deadline, max_team_size, is_team_based, created_by, status, prize_details, banner_url
- `competition_categories`: id, competition_id, name (e.g. "AI Track", "Web Dev Track")
- `competition_registrations`: id, competition_id, student_id, team_id (nullable), category_id, registered_at, status (registered/confirmed/withdrawn/disqualified)
- `competition_teams`: id, competition_id, name, captain_id
- `competition_team_members`: team_id, student_id, role
- `competition_results`: id, competition_id, student_id (or team_id), category_id, placement (1st/2nd/3rd/participant/finalist), score (raw), award_title, verified_by, result_file_url
- `competition_scores`: id, result_id, grant_period_id, awarded_points (based on level + placement matrix)

#### 3.E.3 Scoring Matrix
Admin-configurable table:
| Level | 1st | 2nd | 3rd | Finalist | Participant |
|---|---|---|---|---|---|
| International | 100 | 80 | 60 | 30 | 10 |
| National | 80 | 60 | 45 | 20 | 8 |
| Regional | 60 | 45 | 30 | 15 | 5 |
| University | 40 | 30 | 20 | 10 | 3 |

#### 3.E.4 API Endpoints
```
POST /competitions                                 — create (dept_admin, mentor)
GET  /competitions                                 — list with filters (type, level, status, date)
GET  /competitions/:id                             — detail
PUT  /competitions/:id/status                      — advance lifecycle state
POST /competitions/:id/register                    — student self-register (solo or create team)
POST /competitions/:id/teams/:teamId/join          — join existing team
POST /competitions/:id/results                     — bulk upload results (admin)
GET  /students/:id/competitions                    — competition history
GET  /competitions/:id/leaderboard                 — ranked results
POST /competitions/:id/results/verify              — verify result + trigger scoring
```

---

### MODULE F — Startup Support System

**Objective:** Track student startups from idea to operational stage, connect them with mentors and resources, and capture startup involvement as a grant criterion.

#### 3.F.1 Startup Lifecycle Stages
```
Idea → Validation → MVP → Early Traction → Growth → Operational
```

#### 3.F.2 Data Model
- `startups`: id, name, tagline, description, industry_tags[], stage, website_url, pitch_deck_url, logo_url, created_at, is_active
- `startup_members`: startup_id, student_id, role (founder/co-founder/developer/designer/marketing/advisor), joined_at, left_at
- `startup_mentors`: startup_id, mentor_id, assigned_by, start_date, end_date, is_active
- `startup_updates`: id, startup_id, posted_by, type (milestone/funding/pivot/team_change/product_update), title, body, media_urls[], posted_at
- `startup_milestones`: id, startup_id, title, description, target_date, completed_date, status, verified_by
- `startup_funding_rounds`: id, startup_id, round_type (pre-seed/seed/angel/grant), amount (optional), date, investor_name, description
- `startup_pitches`: id, startup_id, event_name, pitch_date, outcome (won/finalist/rejected/pending), prize_amount, feedback_summary
- `startup_resource_requests`: id, startup_id, resource_type (legal/accounting/workspace/technical/networking), description, status, resolved_by

#### 3.F.3 University Support Features
- Mentors can be assigned to startups by department_admin
- Startup can apply for university-backed resources (workspace, legal consultation)
- Startup pitches link to competition module when pitch is at a competition
- Startups visible on a public-facing directory (opt-in)

#### 3.F.4 Scoring Contribution
- Active startup membership: base score
- Funding received: bonus
- Verified milestone completion: incremental bonus
- Competition pitch placement: links to competitions module
- Mentor-verified active contribution (not just nominal membership)

#### 3.F.5 API Endpoints
```
POST /startups                                     — create startup
GET  /startups                                     — directory (public opt-in)
GET  /startups/:id                                 — detail
PUT  /startups/:id                                 — update
POST /startups/:id/members                         — add member (captain invite)
POST /startups/:id/updates                         — post milestone/update
POST /startups/:id/mentors/request                 — request mentor assignment
PUT  /startups/:id/mentors/:mentorId/assign        — assign mentor (dept_admin)
GET  /students/:id/startups                        — student's startup involvement history
POST /startups/:id/pitches                         — log a pitch
POST /startups/:id/resources/request               — resource request
```

---

### MODULE G — Club Activity System

**Objective:** Clubs have full membership management, an advanced club-specific certification system created and awarded by club mentors, and a teacher-student programme where senior students teach juniors.

#### 3.G.1 Club Structure
- `clubs`: id, department_id (nullable — some are university-wide), name, description, category (academic/sport/art/tech/cultural/social/other), logo_url, is_active, created_at
- `club_mentors`: club_id, user_id (mentor), role (head_mentor/co_mentor), assigned_at
- `club_memberships`: id, club_id, student_id, status (pending/active/inactive/expelled), joined_at, role (member/officer/president/secretary/treasurer)
- `club_activities`: id, club_id, name, type (workshop/session/event/project/trip), date, description, attendance_required, created_by
- `club_activity_participants`: activity_id, student_id, attended, role (attendee/organiser/speaker), noted_contribution

#### 3.G.2 Club Certification System
Club mentors define their own certification tracks, independent of university certificates:
- `club_cert_tracks`: id, club_id, name (e.g. "Full-Stack Web Dev", "Public Speaking Level 2"), description, requirements (JSONB), level (beginner/intermediate/advanced), is_active
- `club_cert_requirements` (JSONB structure): list of criteria — attendance thresholds, project completions, skill assessments
- `club_cert_assessments`: id, track_id, student_id, assessed_by (club_mentor), assessment_date, scores (JSONB), passed, feedback
- `club_certificates`: id, track_id, student_id, awarded_by, awarded_at, certificate_url (generated PDF), is_revoked, revoke_reason

Certificates are auto-generated as signed PDFs and stored in object storage.

#### 3.G.3 Teacher-Student Programme
This is a formalised peer-teaching structure inside clubs where capable students are approved to teach other students — addressing the university's problem-student pipeline:
- `teacher_student_roles`: id, club_id, student_id (the teacher-student), approved_by (club_mentor), specialisation, start_date, end_date (nullable), is_active
- `peer_teaching_sessions`: id, teacher_student_id, topic, session_date, student_attendees[] (student_ids), duration_minutes, notes, session_recording_url
- `peer_teaching_feedback`: id, session_id, given_by_student_id, rating (1–5), comment, submitted_at
- `teacher_student_outcomes`: id, teacher_student_id, period_id, students_taught_count, avg_feedback_score, special_commendation

Teacher-student feedback flows into the **Feedback Module** and is factored into the relevant student's grant score under the `club_activity` and `feedback_score` criteria.

#### 3.G.4 API Endpoints
```
POST /clubs                                        — create club (dept_admin)
GET  /clubs                                        — list (filterable by category, department)
POST /clubs/:id/join                               — membership request
PUT  /clubs/:id/members/:studentId/approve         — approve/reject (club_mentor)
POST /clubs/:id/activities                         — create activity
POST /clubs/:id/activities/:actId/attendance       — record attendance
POST /clubs/:id/cert-tracks                        — create certification track (club_mentor)
POST /clubs/:id/cert-tracks/:trackId/assess        — submit assessment
GET  /students/:id/club-certificates               — all club certs earned
POST /clubs/:id/teacher-students                   — nominate teacher-student role
POST /teacher-students/:id/sessions                — log peer teaching session
POST /sessions/:id/feedback                        — submit peer feedback
GET  /students/:id/clubs                           — all club memberships + activity + certs
```

---

### MODULE H — Internships & Work Experience

**Objective:** Track whether a student is working, has worked, or has completed a formal internship — including overlap with academic periods.

#### 3.H.1 Data Model
- `internships`: id, student_id, company_name, position, type (internship/part_time/full_time/freelance), industry, start_date, end_date (nullable — null = currently active), is_verified, verification_doc_url, verified_by, description, skills_gained[], is_relevant_to_field
- `internship_verifications`: id, internship_id, verifier_user_id, method (document/employer_contact/lms_reference), verified_at, notes
- `internship_evaluations`: id, internship_id, evaluator_id (mentor), technical_rating (1–5), professional_rating (1–5), comment, evaluated_at

#### 3.H.2 Overlap Detection
When a new internship record is created:
- Check for overlap with academic semesters
- Flag if full-time work overlaps with non-vacation academic period (requires mentor acknowledgment)
- Co-op/internship during university-approved internship semester gets a verification bonus

#### 3.H.3 Scoring Contribution
- Internship during academic semester (relevant field): high score
- Internship during vacation: moderate score
- Currently employed: bonus for professional activity
- Verified by document vs unverified: score multiplier

#### 3.H.4 API Endpoints
```
POST /internships                                  — student submits internship record
GET  /internships?studentId=                       — list
GET  /internships/:id                              — detail
PUT  /internships/:id/verify                       — mentor verify
POST /internships/:id/evaluate                     — mentor evaluation
GET  /students/:id/work-history                    — full work timeline
```

---

### MODULE I — Grant Scoring Engine

**Objective:** A configurable, transparent, auditable scoring engine that computes a composite student score per grant period and produces a ranked list for grant administrators.

#### 3.I.1 Scoring Computation
Implement a `ScoreComputationService` that:
1. For each student in the cohort, pulls the latest verified data from all 7 criterion modules
2. Normalises each raw metric to a 0–100 scale (normalisation functions are per-module, configurable)
3. Applies the admin-configured weights from `scoring_configs.criteria_weights`
4. Computes `total_score = Σ (normalised_score_i × weight_i)`
5. Applies tiebreaker logic (e.g. grades take priority over attendance if scores are equal)
6. Writes results to `student_grant_scores` with a SHA-256 hash of input data for integrity
7. Emits a `score.computed` event to the notification queue

Trigger score computation:
- On-demand via `POST /admin/grant-periods/:id/compute-scores` (grant_admin)
- Automatically at scheduled intervals during active grant period
- On any significant data change (new grade sync, new verified achievement, etc.) via event listener

#### 3.I.2 Ranking & Leaderboard
- `GET /admin/grant-periods/:id/rankings` — paginated, filterable by department/group, sortable by any criterion
- Response includes: rank, total_score, criterion_breakdown, evidence_summary, any flags
- Grant admin can see full criterion breakdown per student
- Drill-down to individual score contribution for transparency and appeals

#### 3.I.3 Grant Decision Workflow
```
Score computed → Grant admin reviews ranking → Selects recipients → Publishes decision →
Students notified → Appeal window opens (7 days) → Appeals reviewed → Final decision
```
- `POST /admin/grant-periods/:id/decisions` — bulk or individual decisions
- `POST /grant-decisions/:id/appeal` — student submits appeal with evidence
- `PUT /appeals/:id/review` — grant_admin reviews appeal
- Full audit trail on every state transition

#### 3.I.4 Analytics & Reports
- Department comparison heatmap data
- Semester-over-semester score trend per student
- Criterion contribution breakdown (which module drives the most score variance)
- Exportable as CSV/Excel for external reporting
- `GET /admin/reports/grant-period/:id` — comprehensive report endpoint

---

### MODULE J — AI Recommendation Engine (Gemini Flash)

**Objective:** After significant academic events, the system initiates a conversational debrief with the student and then generates personalised, actionable recommendations based on their profile and the event outcome.

#### 3.J.1 Event Triggers
The recommendation engine activates on any of these events:
| Trigger event | Example |
|---|---|
| `grades.final_published` | Final exam results posted for a subject |
| `grades.monthly_published` | Monthly grades updated |
| `attendance.threshold_breached` | Attendance drops below 70% in a subject |
| `competition.result_posted` | Student receives competition result |
| `internship.ended` | Internship period completed |
| `achievement.rejected` | Certificate verification rejected |
| `grant.score_computed` | Student's grant score drops significantly |
| `club.cert_assessment_failed` | Failed a club certification assessment |

#### 3.J.2 Recommendation Conversation Flow
```
1. Event fires → system enqueues a RecommendationJob
2. Job builds context payload (student profile + event data + recent history)
3. System sends student a notification: "Hey [name], looks like [event]. How did it go?"
4. Student replies via the in-app chat widget
5. System sends context + student reply to Gemini Flash with a structured prompt
6. Gemini generates a personalised recommendation response
7. Response is parsed, structured into `Recommendation` objects, and stored
8. Student sees the recommendations in their dashboard
9. Student can mark recommendations as acted-on, dismissed, or request more detail
```

#### 3.J.3 Gemini Flash Prompt Architecture
System prompt (constant):
```
You are EduMetrix, an academic life coach assistant for a university student.
You have access to the student's current profile data. Your job is to:
1. Acknowledge what happened empathetically
2. Ask one targeted question about how the student feels about it
3. Based on their response, give 2-4 concrete recommendations from the available actions below.
Always respond in JSON format: { "message": string, "recommendations": Recommendation[] }
```

Recommendation types the engine can produce:
- `JOIN_CLUB` — { club_id, club_name, reason }
- `STUDY_RESOURCE` — { subject_id, resource_title, resource_url, reason }
- `COMPETITION` — { competition_id, competition_name, reason }
- `INTERNSHIP_PLATFORM` — { platform_name, url, reason }
- `MENTOR_SESSION` — { mentor_id (optional), topic, reason }
- `PEER_TEACHING` — { teacher_student_id, club_id, reason }
- `IMPROVE_ATTENDANCE` — { subject_id, current_rate, reason }
- `STARTUP_RESOURCE` — { resource_type, description, reason }
- `GRANT_ACTION` — { criterion, current_score, max_achievable, action_description }

#### 3.J.4 Data Model
- `recommendation_sessions`: id, student_id, trigger_event_type, trigger_entity_id, status (pending/active/completed/dismissed), created_at
- `recommendation_messages`: id, session_id, role (system/assistant/user), content, created_at
- `recommendations`: id, session_id, type, payload (JSONB), is_acted_on, is_dismissed, acted_on_at, created_at
- `recommendation_outcomes`: id, recommendation_id, outcome_type (grade_improved/joined_club/entered_competition/etc.), measured_at, delta_score

Track recommendation outcome effectiveness over time to improve prompt quality.

#### 3.J.5 API Endpoints
```
GET  /recommendations                              — student's active recommendations
POST /recommendations/:sessionId/reply             — student sends reply in debrief chat
PUT  /recommendations/:id/act                      — mark as acted on
PUT  /recommendations/:id/dismiss                  — dismiss
GET  /admin/recommendations/analytics              — aggregate effectiveness metrics
```

---

## 4. Cross-Cutting Infrastructure

### 4.1 Notifications System
- `notifications`: id, user_id, type, title, body, related_entity_type, related_entity_id, is_read, created_at
- Channels: in-app (WebSocket push), email (SMTP/SendGrid), push (FCM) — per-user preference
- `notification_preferences`: user_id, channel, event_type, is_enabled
- Notification templates stored in DB (editable by admin)
- Key notification events: grant period opens/closes, score computed, achievement verified/rejected, feedback received, recommendation ready, competition deadline, club cert awarded

### 4.2 Audit Log
Every write action must append to:
- `audit_logs`: id, actor_user_id, action (snake_case verb), entity_type, entity_id, old_value (JSONB), new_value (JSONB), ip_address, user_agent, created_at

Never delete from audit log. Implement log rotation to cold storage after 2 years.

### 4.3 File Upload Service
- Presigned S3 upload URLs for client-side direct upload
- Virus scan hook before finalising upload
- Accepted types per entity type (e.g. achievements: PDF/JPG/PNG; pitch decks: PDF/PPTX)
- File metadata stored in `file_uploads`: id, uploader_id, entity_type, entity_id, original_filename, s3_key, mime_type, size_bytes, uploaded_at

### 4.4 API Design Standards
- REST with consistent response envelope: `{ data, meta, errors }`
- Pagination: cursor-based for large lists
- Filtering: query params with a `filter[field]=value` convention
- Versioning: `/api/v1/` prefix
- Rate limiting: per-role (students: 60 req/min, admins: 300 req/min)
- Comprehensive OpenAPI 3.1 spec auto-generated

### 4.5 Background Job Queue
Queues to implement:
- `lms-sync` — nightly grade/attendance pull
- `score-compute` — triggered scoring jobs (debounced per student, 15-min delay after last data change)
- `recommendation` — AI conversation jobs (rate-limited per student: 1 per event type per 24h)
- `notification-dispatch` — fan-out notifications to channels
- `report-export` — async generation of large reports
- `file-process` — post-upload virus scan and OCR metadata extraction

---

## 5. Additional Brilliant Ideas to Implement

### 5.1 Smart Grant Simulator (Student-Facing)
On the student dashboard: "What if?" simulator. A student can drag criterion sliders to see how their total grant score would change if they, e.g., joined a club (+X points), completed an internship (+Y points), or won a regional competition (+Z points). Show the gap to the current eligibility threshold in real time. This drives engagement and targeted effort.

### 5.2 Mentor Dashboard — "At Risk" Alerts
Mentors see a list of their assigned students sorted by a composite "at risk" signal: students who have recently had a grade drop, attendance breach, and no active club/startup activity. Threshold-based alerts: amber (one signal), red (two or more). Automatically suggest scheduling a mentor session.

### 5.3 Grant Transparency Mode
When grant decisions are published, each student can see their own score breakdown in a visual "why I scored X" report. They see their normalised sub-score per criterion, where they rank relative to the group median, and exactly which pieces of evidence contributed points. This reduces disputes and makes the system feel fair.

### 5.4 Peer Comparison (Anonymised)
On the student's score page: anonymised distribution chart showing where they sit in their cohort for each criterion. Not ranked identities — just a bell curve with their own position marked. Motivates without shaming.

### 5.5 Club Smart Matching
When a student receives a recommendation to join a club, the engine checks club capacity, whether the student's schedule (based on attendance records) conflicts with club meeting times, and whether the student's academic strengths align with the club's cert track prerequisites before recommending.

### 5.6 Achievement OCR Auto-fill
When a student uploads a certificate image/PDF, send it to Gemini Vision to extract: issuer name, certificate title, date, and student name. Pre-fill the achievement form with extracted data. The student confirms and submits. Reduces friction and data entry errors.

### 5.7 Internship Network Graph
Track which companies students intern at over time. Surface to department_admin as a network graph: most popular employers, industries, average duration. Enables the university to build formal employer partnerships.

### 5.8 Scoring Explainability Engine
Every time a score is computed, persist a human-readable explanation: "Your grades sub-score is 72/100 because your semester GPA is 3.4 (above average) but declined 0.2 from last semester." Store these explanations in `score_explanations` and surface them in the grant transparency report and the AI recommendation context.

### 5.9 Grant Period Comparison
Grant admins can overlay two grant periods to see which students improved, regressed, or entered/left eligibility. A "delta view" shows +/- per criterion. Useful for measuring programme effectiveness.

### 5.10 Webhook Outbox for LMS
Instead of only pulling from the LMS, expose an inbound webhook endpoint so the LMS can push grade events in real time when grades are posted. Fall back to polling if the LMS doesn't support webhooks.

---

## 6. Database Indexing & Performance Notes

- Index `student_grant_scores(grant_period_id, total_score DESC)` for O(1) ranking queries
- Partial index on `achievements(status='pending')` for verification queue
- Materialised view `mv_student_profile_summary` refreshed on score compute: join of all criterion aggregates per student per grant period
- `competition_results` and `club_cert_assessments` partitioned by semester_id for historical queries
- Full-text search index on `competitions.name`, `clubs.name`, `startups.name` for discovery

---

## 7. Security Requirements

- All PII encrypted at rest (AES-256); student_id, email, phone treated as sensitive
- API keys (LMS, Gemini) stored in secrets manager (not `.env` files)
- Gemini prompt/response logs must redact full student PII — use internal IDs only in AI calls
- Grant ranking data is accessible only to `grant_admin` and `super_admin` — not to mentors or department admins
- Student can see own data only (except competition leaderboards which are optionally public)
- CSP, rate limiting, and brute-force protection on auth endpoints
- GDPR-style data export endpoint per student: `GET /students/:id/data-export`

---

## 8. Testing Strategy

- Unit tests: scoring engine normalisation functions, permission middleware, Gemini response parser
- Integration tests: LMS sync job with mock LMS server, full grant computation pipeline, file upload + virus scan flow
- E2E tests: full student journey (enrol → submit achievement → get verified → score computed → recommendation received)
- Load test: score computation for 5,000 students concurrently
- Seed script: generate realistic fake data for all modules for a full academic semester

---

## 9. Deliverables Expected

1. **ERD** — full entity-relationship diagram for all tables
2. **OpenAPI 3.1 spec** — all endpoints documented with request/response schemas
3. **Migration files** — versioned DB migrations (e.g. Prisma, Alembic, or Knex)
4. **Folder/module structure** — one module = one folder with its routes, service, repository, and tests
5. **Scoring engine** — isolated, unit-testable service with pluggable normalisation functions
6. **Gemini integration service** — with retry logic, token counting, and prompt versioning
7. **Background job definitions** — all queues with retry/backoff config
8. **RBAC middleware** — reusable permission-checking decorators/middleware
9. **README** — setup guide, environment variables, how to seed data, how to run tests

---

*EduMetrix — making every dimension of student life visible, fair, and improvable.*
