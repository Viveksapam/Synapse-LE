# Backend — FastAPI System Specification

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | FastAPI |
| Database (local) | SQLite |
| Database (production) | PostgreSQL |
| ORM | SQLAlchemy |
| Validation & Schemas | Pydantic |
| Migrations | Alembic |
| Authentication | JWT tokens |

---

## 2. Folder Structure

```
backend/
  ├── venv/
  ├── .env
  ├── .env.example          ← Document every variable; mark sensitive ones
  ├── requirements.txt
  ├── main.py               ← Application entry point and FastAPI instance
  ├── dependencies.py       ← Shared FastAPI dependencies (e.g., get_current_user)
  ├── routers/              ← Route handlers only; no business logic
  │   ├── user.py
  │   └── product.py
  ├── services/             ← Business logic; called by routers
  │   ├── user_service.py
  │   └── product_service.py
  ├── models/               ← SQLAlchemy database models
  │   └── user_model.py
  ├── schemas/              ← Pydantic models for request/response validation
  │   └── user_schema.py
  ├── migrations/           ← Alembic migration scripts (auto-generated)
  │   └── versions/
  └── tests/                ← Mirrors routers/ and services/ hierarchy
      ├── test_user.py
      └── test_product.py
```

---

## 3. Naming Conventions

### 3.1 Files

| File | Purpose |
|---|---|
| `main.py` | Application entry point and FastAPI instance |
| `routers/<resource>.py` | Route handlers for a resource (e.g., `users.py`, `products.py`) |
| `services/<resource>_service.py` | Business logic for a resource |
| `models/<resource>_model.py` | SQLAlchemy model for a resource |
| `schemas/<resource>_schema.py` | Pydantic schemas for a resource |

### 3.2 Variables

| Type | Pattern | Example |
|---|---|---|
| String | `str<Name>` | `strProductName`, `strErrorMsg` |
| Number | `num<Name>` | `numOrderCount`, `numPrice` |
| Boolean | `bool<Name>` | `boolIsActive`, `boolIsVerified` |
| List | `arr<Name>` | `arrProductList` |
| Dictionary | `dict<Name>` | `dictUserData` |

---

## 4. API Conventions

- All endpoints prefixed: `/api/`
- Standard RESTful operations.
- Always return JSON.
- Authentication via JWT tokens, injected through FastAPI dependency.

### 4.1 Route Handler Rule

Route handlers: parse request → call service → return response. No business logic.

### 4.2 Authentication

All protected endpoints use `get_current_user` dependency. No manual auth checks.

---

## 5. Code Styling & Quality

- **Style guide**: PEP 8.
- **Type hinting**: Enforced on all function signatures, router endpoints, and schema fields.
- **Documentation**: All public endpoints and service functions must have Google-style docstrings.
- **Line length**: Maximum 100 characters.
- **Linting**: `flake8` and `mypy` run in CI. Zero errors permitted.

```python
def get_product_by_id(db: Session, num_product_id: int) -> ProductResponse:
    """
    Retrieve a single product by its primary key.

    Args:
        db: Active SQLAlchemy database session.
        num_product_id: Primary key of the product to retrieve.

    Returns:
        ProductResponse schema populated from the database record.

    Raises:
        HTTPException: 404 if no product with the given ID exists.
    """
    obj_product = db.query(Product).filter(Product.id == num_product_id).first()
    if not obj_product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return obj_product
```

---

## 6. Security

### 6.1 JWT Token Handling

- Tokens are issued with a short expiry (`ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`).
- Refresh token rotation must be implemented — single-use refresh tokens only.
- Never log JWT token values. Never return them in error responses.

### 6.2 Password Handling

- Passwords are hashed using `bcrypt` via `passlib`. Never store plaintext passwords.
- Never log password values at any verbosity level.

### 6.3 Input Validation

- All request bodies are validated by Pydantic schemas before reaching route handlers.
- No raw user input is interpolated into SQL strings. Use SQLAlchemy ORM queries exclusively.

### 6.4 Dependency Auditing

- `pip-audit` runs in CI on every push.
- PRs are blocked from merging on high or critical severity CVEs.

### 6.5 Environment Variables & Secrets

- All secrets (`SECRET_KEY`, `DATABASE_URL`, credentials) are in `.env` only.
- `.env` is in `.gitignore` and must never be committed.
- `.env.example` documents every variable with a comment marking it sensitive or safe.
- No secret or credential appears in `main.py`, `config.py`, or any committed file.

### 6.6 CORS

- `CORSMiddleware` is configured in `main.py` with an explicit `allow_origins` allowlist.
- `allow_origins=["*"]` is banned in any environment.

```python
# main.py — correct
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # list from .env
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

---

## 7. API Error & Response Envelopes

### 7.1 Error Envelope

All HTTP 4xx/5xx responses return a standard JSON object:

```json
{"detail": "Error explanation in plain language."}
```

No non-standard shapes. No DRF-style `{"non_field_errors": [...]}` residue.

### 7.2 Paginated List Envelope

All paginated list endpoints conform to:

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 10
}
```

---

## 8. Database & Migrations

### 8.1 Alembic Rules

- Every change to a SQLAlchemy model in `models/` must have a corresponding Alembic migration script.
- Migration scripts are auto-generated: `alembic revision --autogenerate -m "description"`.
- Review auto-generated scripts before committing — autogenerate misses some changes.
- Never execute raw SQL DDL (`ALTER TABLE`, `CREATE INDEX`) directly on production databases.
- Always apply schema changes through the Alembic migration history.

### 8.2 SQLAlchemy Patterns

Use SQLAlchemy ORM exclusively. Django ORM patterns have no place here.

```python
# WRONG — Django ORM residue
User.objects.filter(bool_is_active=True)
instance.save()

# CORRECT — SQLAlchemy
db.query(User).filter(User.bool_is_active == True).all()
db.add(instance)
db.commit()
db.refresh(instance)
```

### 8.3 Session Management

Database sessions are injected via FastAPI dependency. Never instantiate a session
manually inside a route handler or service.

```python
# dependencies.py
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 9. Testing Standards

### 9.1 Test Pyramid

```
       ┌──────────┐
       │   E2E    │  Few — critical API flows end-to-end.
      ┌┴──────────┴┐
      │Integration │  Some — route handlers with in-memory DB.
     ┌┴────────────┴┐
     │  Unit Tests  │  Many — service functions and utility logic.
     └──────────────┘
```

### 9.2 Coverage Targets

| Layer | Target | Scope |
|---|---|---|
| Unit | ≥ 80% line coverage | `services/`, utility functions |
| Integration | Key flows covered | All route handlers; happy path + primary error path |
| E2E | Critical journeys covered | Auth, primary resource CRUD |

### 9.3 Test File Placement

Test files mirror the source hierarchy and live in `tests/`:
- `tests/test_user.py` → tests for `routers/user.py` and `services/user_service.py`
- `tests/test_product.py` → tests for `routers/product.py` and `services/product_service.py`

### 9.4 Database Session Mocking

Use pytest fixture with in-memory SQLite. Auto-rollback after each test. See ADR-testing for full setup.

### 9.5 External Mocking

Mock all external HTTP calls using `responses` or `unittest.mock`. No network calls in tests.

---

## 10. CI/CD Pipeline

Every push triggers the full pipeline. PRs cannot be merged without a green pipeline.

```
Step 1 — Lint
  flake8 backend/ --max-line-length=100
  mypy backend/
  (Zero errors tolerated.)

Step 2 — Dependency Audit
  pip-audit
  (Fail on high or critical CVEs.)

Step 3 — Unit & Integration Tests
  pytest tests/ --cov=app --cov-report=term-missing
  (Fail if coverage drops below targets in §9.2.)

Step 4 — Build Check
  Verify the application starts cleanly:
  uvicorn main:app --host 0.0.0.0 --port 8000 (smoke test)

Step 5 — Migration Check
  alembic upgrade head
  (Fail if any migration script errors.)
```

**Branch protection rules:**
- `main` and `develop` are protected branches.
- Direct push is blocked; all changes via PR.
- Minimum one code-review approval required.
- Pipeline must be green before merge is permitted.

---

## 11. Development Workflow

### 11.1 Before Every Commit

```bash
flake8 backend/           # zero errors
mypy backend/             # zero type errors
pytest tests/             # all tests green
pip-audit                 # no high/critical CVEs
```

### 11.2 Before Every PR

- Confirm route handler contains no business logic.
- Confirm all new endpoints and service functions have docstrings.
- Confirm all model changes have a corresponding Alembic migration script.
- Confirm no secrets appear in any changed file.
- Confirm `requirements.txt` contains no banned packages (see §14.4).

### 11.3 Commit Messages

Follow Conventional Commits format:

```
feat(orders): add order creation endpoint
fix(auth): correct token expiry calculation
refactor(user): remove Django ORM residue from user service
chore(deps): update sqlalchemy to 2.0.x
```

---

## 12. Agent Behaviour (AI-assisted Development)

- **Planning**: Show a file-level plan before creating new routers or models.
- **Safety**: Never install packages without explicit confirmation. Never delete files without confirmation.
- **Delegation**: Keep route handlers thin — delegate all logic to `services/`.
- **Security**: Flag any pattern that resembles raw SQL interpolation, plaintext passwords, hardcoded secrets, or `allow_origins=["*"]` — even in existing code.
- **Cleanup**: When touching a file, flag any violation from §13–§16 in the same response. Do not silently leave known debt.

---

## 13. Refactoring Philosophy

Refactoring is not a separate activity scheduled "later." It is the discipline of
leaving every file you touch in a cleaner state than you found it.

**The Boy Scout Rule**: Before submitting any PR, scan the files you touched.
If you see a violation listed in §14–§16, fix it in the same PR — not a follow-up ticket.

**Scope discipline**: Refactors that touch more than 5 files must be their own
dedicated PR, separate from feature work. Mixing refactor and feature changes makes
both harder to review and harder to revert.

---

## 14. Migration Debt — Django → FastAPI

Delete all Django artifacts on sight: `settings.py`, `urls.py`, `views.py`, `forms.py`, `admin.py`, `manage.py`, `serializers.py`, DRF permission classes.

**Audit**: `grep -r "from django\|import django\|rest_framework" backend/ --include="*.py"`

### 14.2 ORM Pattern Conflicts

No Django ORM patterns (`User.objects.filter()`, `instance.save()`). Use SQLAlchemy exclusively.
Replace signal/receiver patterns with explicit service-layer calls.

### 14.3 Authentication Migration

No Django session auth. Use FastAPI JWT dependency injection everywhere.

### 14.4 Requirements Cleanup

Ban these packages: Django, djangorestframework, django-cors-headers, django-environ, django-filter, whitenoise.
Verify: `pip install -r requirements.txt && pip check`

---

## 15. Code-Level Refactoring Rules

### 15.1 No Commented-Out Code

Commented-out code is prohibited in any committed file. It creates noise,
misleads future readers, and is never retrieved from comments in practice —
it is retrieved from git history.

```python
# BANNED
# def old_auth_handler(request):
#     return request.session['user']

# BANNED
# class OldUserSerializer(serializers.ModelSerializer): ...
```

**Only permitted exception**: A `TODO:` or `FIXME:` with a ticket number and owner.

```python
# TODO(#142): Replace with async task queue when Celery is confirmed — @yourname
```

### 15.2 No Magic Numbers or Strings

All non-obvious literals must be named constants. Example: `MAX_FAILED_LOGIN_ATTEMPTS = 5`.

### 15.3 No Business Logic in Route Handlers

Route handlers: parse input, call service, return result only. Delegate all logic to services.

### 15.4 Single Source of Truth for Schemas

One Pydantic schema per request/response shape. Do not define the same structure
in both a schema file and inline inside a route handler or service.

### 15.5 Consistent Error Response Shape

All `HTTPException` use standard envelope (§7.1). No DRF-style residue like `{"non_field_errors": [...]}`.

### 15.6 No Duplicate API Endpoints

Detect duplicate route paths after migration:

```bash
grep -r "@router\." backend/routers/ --include="*.py" \
  | grep -oP '"\/[^"]+"' | sort | uniq -d
```

Any path printed by this command is a conflict. Resolve before merging.

### 15.7 No print() in Production Paths

Remove all `print()` before committing. Use `logging` module instead.

---

## 16. Refactoring Workflow

### 16.1 Scheduled Cleanup Sprint

Once per development cycle (every 4–6 feature sprints), run a dedicated cleanup
sprint with no feature work. Agenda:

1. Run Django residue grep checks — §14.1, §14.3.
2. Audit `requirements.txt` for banned packages — §14.4.
3. Run duplicate endpoint check — §15.6.
4. Audit all route handlers for business logic leakage — §15.3.
5. Scan for `print()` statements in production code — §15.7.
6. Run `pip-audit` and resolve any outstanding CVEs.

Document findings as a list of small, independently reviewable cleanup PRs.

### 16.2 Refactor PR Rules

A PR whose primary purpose is refactoring must:
- Use `refactor:` Conventional Commit prefix.
- Not change any user-visible behaviour.
- Include a "before / after" summary in the PR description.
- Pass all existing tests without modifying test assertions.
  If test assertions must change, the refactor changed behaviour — stop and reassess.

### 16.3 When to Refactor vs. Dedicated PR

| Signal | Action |
|---|---|
| File violates 100-character line limit | Fix immediately in same PR |
| Function does more than one thing | Extract to service; do it now if it blocks understanding |
| Naming violates convention | Rename using IDE; update all call sites in same PR |
| Logic duplicated in 2 places | Extract to service before adding a third |
| Logic duplicated in 3+ places | Dedicated refactor PR before any further feature work |
| Route handler contains business logic | Extract to service; same PR |
| Django ORM pattern found in SQLAlchemy service | Dedicated refactor PR |

---

## 17. Definition of Done — Backend

A task is only done when all of the following are true:

- [ ] Route handler contains no business logic — delegates entirely to a service.
- [ ] All new endpoints and service functions have Google-style docstrings.
- [ ] All new Pydantic schemas follow the naming convention and live in `schemas/`.
- [ ] All SQLAlchemy model changes have a corresponding Alembic migration script.
- [ ] No `print()` statements in production paths.
- [ ] No raw SQL strings (`text("SELECT ...")`) without documented justification.
- [ ] No magic numbers or strings — all literals are named constants.
- [ ] No commented-out code in the changeset.
- [ ] `requirements.txt` contains no banned Django packages.
- [ ] No secrets or credentials appear in any changed file.
- [ ] CI pipeline is fully green (lint → type check → audit → test → migration check).
