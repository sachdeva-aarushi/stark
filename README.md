<div align="center">

<h1>STARK</h1>
<h3>Autonomous workflows. Controlled execution.</h3>
<p>An AI workflow orchestration platform for designing, executing, and supervising multi-agent systems.</p>

<p>
  <img src="https://img.shields.io/badge/Python-3.10%2B-315B75?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/API-FastAPI-2F6F63?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Orchestration-LangGraph-4B5563?style=flat-square" alt="LangGraph">
  <img src="https://img.shields.io/badge/Data-PostgreSQL-416987?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Vector-pgvector-416987?style=flat-square" alt="pgvector">
  <img src="https://img.shields.io/badge/Frontend-React-397A8A?style=flat-square&logo=react&logoColor=white" alt="React">
</p>

<p><a href="#overview">Overview</a> · <a href="#system-design">Architecture</a> · <a href="#technical-implementation">Implementation</a> · <a href="#engineering-and-release-discipline">Engineering</a></p>

</div>

---


## Overview

Modern organisations increasingly need AI systems that can do more than
generate a response. Operational tasks often require several distinct
capabilities: decomposing an objective, retrieving internal knowledge,
invoking tools, analysing intermediate results, validating outputs, and
obtaining approval before consequential actions are taken.

STARK is an orchestration layer for those workflows. It coordinates
specialised agents through explicit execution graphs, gives each run a
persistent identity and state, and exposes the execution lifecycle to
users. Rather than treating an agent as an isolated prompt-and-response
loop, STARK treats a workflow as a system of cooperating components with
defined inputs, outputs, transitions, and control points.

The platform is intended for teams that need to compose AI-assisted
processes while retaining visibility into what ran, which components
participated, what evidence was retrieved, where execution paused, and
what result was produced.

### At a glance

-   **Compose:** define workflows from specialised agent capabilities
    and tool integrations.
-   **Execute:** coordinate graph-based tasks with explicit state
    transitions.
-   **Ground:** retrieve relevant workspace documents through a vector
    search layer.
-   **Supervise:** pause workflows at approval boundaries and resume
    them after a decision.
-   **Inspect:** review run status, execution events, outputs, and
    evaluation results.
-   **Persist:** store application data, document metadata, embeddings,
    and workflow records in a PostgreSQL-backed architecture.

## Table of contents

-   [Problem](#problem)
-   [Solution: STARK](#solution-stark)
-   [Features and product
    differentiation](#features-and-product-differentiation)
-   [Technical stack](#technical-stack)
-   [System design](#system-design)
    -   [Logical architecture](#logical-architecture)
    -   [Workflow execution flow](#workflow-execution-flow)
    -   [Document ingestion and
        retrieval](#document-ingestion-and-retrieval)
    -   [Approval and resume lifecycle](#approval-and-resume-lifecycle)
    -   [Core data model](#core-data-model)
-   [Technical implementation](#technical-implementation)
    -   [Backend boundaries](#backend-boundaries)
    -   [Orchestration model](#orchestration-model)
    -   [Persistence strategy](#persistence-strategy)
    -   [RAG and pgvector](#rag-and-pgvector)
    -   [Identity and tenant isolation](#identity-and-tenant-isolation)
    -   [MCP integration and tool
        security](#mcp-integration-and-tool-security)
    -   [Execution observability](#execution-observability)
-   [Repository layout](#repository-layout)
-   [Local development](#local-development)
-   [Configuration](#configuration)
-   [API surface](#api-surface)
-   [Quality, evaluation, and testing](#quality-evaluation-and-testing)
-   [Security and operational
    considerations](#security-and-operational-considerations)
-   [Impact and benefits](#impact-and-benefits)
-   [Market context and scalability](#market-context-and-scalability)
-   [Engineering roadmap](#engineering-roadmap)
-   [Research and references](#research-and-references)
-   [Acknowledgements and licensing](#acknowledgements-and-licensing)

## Problem

A useful enterprise AI workflow is rarely a single model call. A request
may need planning, access to internal documents, one or more external
tools, data transformation, independent validation, and human review.
When these steps are implemented as disconnected scripts or independent
agents, teams encounter recurring engineering problems:

1.  **Fragmented execution:** agents operate in separate processes or
    interfaces, making multi-step work difficult to coordinate and
    inspect.
2.  **Unreliable state:** transient process memory is insufficient for
    workflows that pause, fail, require approval, or need to resume.
3.  **Weak grounding:** model responses can be detached from internal
    sources unless retrieval, metadata, and source context are
    integrated into the workflow.
4.  **Limited operational control:** tool access and consequential
    actions need explicit boundaries, validation, and approval policies.
5.  **Poor traceability:** without structured run records and
    stage-level events, diagnosing failures and evaluating quality
    becomes difficult.
6.  **Duplicated infrastructure:** teams repeatedly build
    authentication, workspace isolation, document storage, workflow
    history, and monitoring around otherwise useful agent code.

The engineering challenge is therefore not simply to increase the number
of agents. It is to provide the execution, persistence, integration, and
governance infrastructure that makes coordinated agents usable as an
application.

## Solution: STARK

STARK provides a structured runtime for multi-agent workflows. A user
submits an objective; the backend validates the request and starts a
graph execution; specialised nodes perform bounded tasks; retrieval and
tools provide context or capabilities; and the workflow records state
and emits events as it progresses.

The design separates three concerns:

-   **Application control plane:** identity, workspaces, workflow
    definitions, configuration, access control, run history, and
    approvals.
-   **Execution plane:** graph scheduling, agent nodes, tool invocation,
    state transitions, retries, validation, and result production.
-   **Knowledge plane:** document ingestion, chunk metadata, embeddings,
    similarity search, and retrieval context.

This separation allows the application layer to evolve without
entangling it with model-specific logic, while the execution layer can
coordinate different models, tools, and retrieval strategies behind
stable interfaces.

### Product workflow

A typical STARK interaction follows this lifecycle:

1.  A user signs in and selects a workspace.
2.  The user creates or selects a workflow and submits an objective.
3.  The API authenticates the request, checks workspace permissions,
    validates input, and creates a run record.
4.  The orchestration layer initializes graph state and invokes the
    configured workflow.
5.  Agents perform specialised work, retrieve relevant knowledge, and
    call only the tools permitted by the workflow policy.
6.  Validation nodes inspect structured outputs and configured
    constraints.
7.  If a policy requires human review, execution pauses at a checkpoint
    and an approval request is presented to an authorised user.
8.  Once approved, the graph resumes from its persisted state; rejected
    or edited requests follow the configured decision path.
9.  The final result, status, and execution events are persisted and
    made available to the user.

## Features and product differentiation

The following capabilities describe the product direction. Their
implementation status should be checked against the current branch and
release notes.

### Stateful multi-agent orchestration

Workflows are represented as explicit graphs rather than an implicit
chain of prompt calls. Nodes can represent deterministic operations,
model-driven agents, retrieval steps, or tool calls. Conditional edges
determine the next step from typed state and validated outputs.

### Persistent workflow lifecycle

Each execution has a durable identifier, status, timestamps, and
associated state. Checkpointing supports interruption and resumption
where configured. Application-level run records and graph checkpoints
are related but distinct: the former support product queries and
analytics; the latter preserve the graph's resumable execution state.

### Workspace-aware retrieval

Documents are associated with workspaces and indexed as chunks with
metadata and embeddings. Retrieval is scoped to the requesting user's
authorised workspace, allowing the same platform to serve multiple teams
without mixing knowledge bases.

### Human approval boundaries

Approval gates introduce a deliberate control point before configured
actions or transitions. The approval record identifies the run,
requested decision, reviewer, timestamp, and outcome. The workflow
resumes only through the server-side approval path.

### Tool interoperability

MCP provides a standard protocol for connecting an application to
external tools and context providers. STARK can use MCP-compatible
integrations while retaining a central policy layer for tool discovery,
permission checks, argument validation, timeouts, and audit events.

### Evaluation and diagnostics

The platform's evaluation direction includes benchmark cases, retrieval
metrics, output checks, per-run diagnostics, and comparisons across
configurations. Evaluation results should record the model, prompt or
workflow version, embedding model, dataset, and execution settings so
comparisons are reproducible.

### What differentiates STARK

STARK's intended differentiation is the combination of workflow
composition, execution visibility, workspace-scoped retrieval, and
approval-aware control in one application. The focus is not on claiming
that multi-agent systems are inherently better than single-agent
systems. The focus is on making a multi-step AI process explicit,
inspectable, and governable.

## Technical stack

The stack below distinguishes the existing foundation from the planned
STARK target. Exact dependency versions must be taken from the
repository lockfiles and deployment configuration rather than inferred
from this document.

### Application and interface

**React + Vite** provide the browser application and development/build
pipeline. The frontend is responsible for workflow configuration, run
submission, execution inspection, document management, approval actions,
and evaluation views. It communicates with the backend through versioned
HTTP APIs and, where implemented, a streaming channel for execution
events.

### API and service layer

**Python + FastAPI** provide request routing, schema validation,
dependency injection, authentication dependencies, service coordination,
and OpenAPI documentation. Pydantic models define request and response
contracts. Long-running graph execution should not block an HTTP request
for its entire lifetime; the API should create a run, dispatch or start
execution through the selected runtime, and expose status/events
separately.

### Agent orchestration

**LangGraph** provides the graph runtime. Its state, nodes, edges,
conditional routing, checkpointing, streaming, and human-in-the-loop
primitives are suited to workflows that combine deterministic code with
model-driven decisions. STARK should keep graph definitions separate
from HTTP route handlers and product-specific database services.

### Relational and vector persistence

**Supabase** is the target managed PostgreSQL platform. PostgreSQL
stores users' application records, workspaces, workflow definitions, run
metadata, approval records, document metadata, and execution events.
**pgvector** stores document embeddings and supports nearest-neighbour
similarity search using PostgreSQL operators and indexes.

The design uses PostgreSQL as the source of truth for application
records. Vector search is a capability inside the database, not a
separate source of truth.

### Authentication and authorisation

**Supabase Auth** provides identity and issues JWTs. FastAPI verifies
incoming bearer tokens and derives the authenticated subject.
Resource-level permissions are checked in the application service layer;
database Row Level Security (RLS) provides an additional enforcement
boundary for direct database access paths that use the user's JWT. A
privileged service key must remain server-side and must never be shipped
to the browser.

### Retrieval and document processing

The ingestion pipeline extracts text from supported files, normalises
it, splits it into chunks, records source metadata, generates
embeddings, and writes chunk records to pgvector. The retrieval layer
embeds a query using the same compatible embedding model and dimension,
applies workspace and metadata filters, ranks candidates, and returns
source-aware passages to the workflow.

### Tool connectivity

**Model Context Protocol (MCP)** standardises how an application
connects to tool and context servers. STARK's MCP client boundary should
be isolated from graph nodes so that tool transport, discovery,
authentication, and error handling can be tested independently of agent
prompts.

### Development and delivery

**Docker Compose** is used by the inherited project for local
multi-service development. The repository also includes backend and
frontend test suites. Deployment targets, queue infrastructure, and
production observability should be documented only after they are
configured and tested in the STARK environment.

## System design

### Logical architecture

The diagram shows the intended target architecture. Solid groupings
describe system boundaries; it is not a claim that every planned
integration is already deployed.

``` mermaid
flowchart TB
    U["User"] --> WEB["STARK Web Application<br/>React + Vite"]
    WEB -->|"HTTPS / JSON API"| API["FastAPI Application"]

    subgraph CONTROL["Application Control Plane"]
        AUTH["JWT Authentication<br/>and Workspace Authorisation"]
        WFS["Workspace and Workflow Services"]
        RUNS["Run and Approval Services"]
        DOCS["Document Management"]
    end

    API --> AUTH
    API --> WFS
    API --> RUNS
    API --> DOCS

    subgraph EXECUTION["Workflow Execution Plane"]
        DISPATCH["Execution Coordinator"]
        GRAPH["LangGraph Runtime"]
        PLAN["Planning Node"]
        RETRIEVE["Retrieval Node"]
        TOOLS["Tool / MCP Nodes"]
        SPECIALISTS["Specialist Agent Nodes"]
        VALIDATE["Validation and Policy Nodes"]

        DISPATCH --> GRAPH
        GRAPH --> PLAN
        PLAN --> RETRIEVE
        RETRIEVE --> SPECIALISTS
        SPECIALISTS --> TOOLS
        TOOLS --> VALIDATE
        VALIDATE -->|"conditional transitions"| GRAPH
    end

    WFS --> DISPATCH
    RUNS <--> GRAPH
    DOCS --> INGEST["Document Ingestion Pipeline"]
    RETRIEVE --> VSEARCH["Retrieval Service"]

    subgraph DATA["Supabase Data Platform"]
        PG[("PostgreSQL<br/>Application Records")]
        VEC[("pgvector<br/>Document Embeddings")]
        AUTHDB[("Supabase Auth")]
        FILES[("Object Storage<br/>if enabled")]
    end

    AUTH <--> AUTHDB
    WFS <--> PG
    RUNS <--> PG
    DOCS <--> PG
    INGEST --> FILES
    INGEST --> VEC
    VSEARCH <--> VEC
    GRAPH <-->|"checkpoints"| PG
    GRAPH -->|"run events and outputs"| PG

    classDef app fill:#EAF0F3,stroke:#547181,color:#172B36,stroke-width:1px;
    classDef service fill:#E9F1EC,stroke:#557C68,color:#20382B,stroke-width:1px;
    classDef data fill:#F3EFE7,stroke:#8A7655,color:#3B3020,stroke-width:1px;
    classDef agent fill:#EEF0F5,stroke:#65718B,color:#263044,stroke-width:1px;

    class U,WEB,API app;
    class AUTH,WFS,RUNS,DOCS,DISPATCH,INGEST,VSEARCH service;
    class PG,VEC,AUTHDB,FILES data;
    class GRAPH,PLAN,RETRIEVE,TOOLS,SPECIALISTS,VALIDATE agent;
```

### Workflow execution flow

``` mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as React Client
    participant API as FastAPI
    participant DB as Supabase PostgreSQL
    participant LG as LangGraph Runtime
    participant RAG as Retrieval Service
    participant MCP as MCP Tool Server

    User->>UI: Submit objective and workflow
    UI->>API: POST /api/v1/workflows
    API->>API: Verify JWT and workspace access
    API->>DB: Create workflow run
    DB-->>API: run_id
    API->>LG: Start graph with run_id and thread_id
    API-->>UI: 202 Accepted + run_id

    LG->>DB: Load / write checkpoint
    LG->>LG: Plan and route task
    LG->>RAG: Retrieve relevant context
    RAG->>DB: Filtered vector similarity query
    DB-->>RAG: Ranked chunks and metadata
    RAG-->>LG: Context with source references

    opt Tool use required
        LG->>MCP: Invoke authorised tool
        MCP-->>LG: Tool result or structured error
    end

    LG->>LG: Validate outputs and evaluate next edge
    LG->>DB: Persist events and updated run state
    UI->>API: GET run status / subscribe to events
    API-->>UI: Status, stage events, and outputs
    LG-->>API: Final state
    API->>DB: Persist terminal status and result
    API-->>UI: Completed run
```

### Document ingestion and retrieval

``` mermaid
flowchart TD
    SOURCE["Workspace document"] --> CHECK["Validate type, size, and access"]
    CHECK --> EXTRACT["Extract text and source metadata"]
    EXTRACT --> NORMALISE["Normalise text"]
    NORMALISE --> CHUNK["Chunk with overlap and provenance"]
    CHUNK --> EMBED["Generate embeddings"]
    EMBED --> STORE["Insert chunk, metadata, and vector"]
    STORE --> INDEX["pgvector index"]

    QUERY["User query / agent query"] --> QEMBED["Embed query with same model"]
    QEMBED --> SEARCH["Similarity search"]
    INDEX --> SEARCH
    SEARCH --> FILTER["Workspace and metadata constraints"]
    FILTER --> RANK["Rank and select context"]
    RANK --> CONTEXT["Return passages and source references"]
    CONTEXT --> AGENT["Downstream graph node"]

    classDef input fill:#EAF0F3,stroke:#547181,color:#172B36;
    classDef process fill:#E9F1EC,stroke:#557C68,color:#20382B;
    classDef storage fill:#F3EFE7,stroke:#8A7655,color:#3B3020;
    class SOURCE,QUERY input;
    class CHECK,EXTRACT,NORMALISE,CHUNK,EMBED,QEMBED,FILTER,RANK,CONTEXT,AGENT process;
    class STORE,INDEX,SEARCH storage;
```

### Approval and resume lifecycle

``` mermaid
stateDiagram-v2
    [*] --> Queued
    Queued --> Running: execution starts
    Running --> Running: next graph node
    Running --> AwaitingApproval: approval gate reached
    AwaitingApproval --> Running: approved / resume
    AwaitingApproval --> Rejected: rejected
    Running --> Completed: terminal success
    Running --> Failed: unrecoverable error
    Running --> Cancelled: cancellation accepted
    Queued --> Cancelled: cancelled before start
    Completed --> [*]
    Rejected --> [*]
    Failed --> [*]
    Cancelled --> [*]
```

The application should define its own canonical run statuses and map
LangGraph interruptions, exceptions, and terminal states into them.
Approval decisions must be authorised against the workspace and run;
clients must not be able to resume arbitrary graph threads by supplying
an identifier.

### Core data model

The following is a conceptual relational model. The final schema,
constraints, indexes, and RLS policies must be maintained as versioned
database migrations.

``` mermaid
erDiagram
    AUTH_USERS ||--o{ PROFILES : has
    PROFILES ||--o{ WORKSPACE_MEMBERS : joins
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : contains
    WORKSPACES ||--o{ WORKFLOWS : owns
    WORKSPACES ||--o{ AGENTS : configures
    WORKFLOWS ||--o{ WORKFLOW_NODES : contains
    WORKFLOWS ||--o{ WORKFLOW_RUNS : executes
    WORKFLOW_RUNS ||--o{ EXECUTION_EVENTS : emits
    WORKFLOW_RUNS ||--o{ APPROVAL_REQUESTS : may_require
    WORKSPACES ||--o{ DOCUMENTS : stores
    DOCUMENTS ||--o{ DOCUMENT_CHUNKS : splits_into

    AUTH_USERS {
        uuid id PK
        string email
    }
    PROFILES {
        uuid id PK, FK
        string display_name
    }
    WORKSPACES {
        uuid id PK
        string name
        uuid created_by FK
    }
    WORKSPACE_MEMBERS {
        uuid workspace_id PK, FK
        uuid user_id PK, FK
        string role
    }
    WORKFLOWS {
        uuid id PK
        uuid workspace_id FK
        string name
        jsonb definition
        int version
    }
    WORKFLOW_NODES {
        uuid id PK
        uuid workflow_id FK
        string node_key
        string node_type
        jsonb configuration
    }
    AGENTS {
        uuid id PK
        uuid workspace_id FK
        string name
        string model_provider
        jsonb configuration
    }
    WORKFLOW_RUNS {
        uuid id PK
        uuid workflow_id FK
        string status
        string thread_id
        timestamptz started_at
        timestamptz completed_at
    }
    EXECUTION_EVENTS {
        uuid id PK
        uuid run_id FK
        string event_type
        jsonb payload
        timestamptz created_at
    }
    APPROVAL_REQUESTS {
        uuid id PK
        uuid run_id FK
        uuid reviewer_id FK
        string status
        timestamptz decided_at
    }
    DOCUMENTS {
        uuid id PK
        uuid workspace_id FK
        string filename
        string status
    }
    DOCUMENT_CHUNKS {
        uuid id PK
        uuid document_id FK
        text content
        vector embedding
        jsonb metadata
    }
```

## Technical implementation

### Backend boundaries

The backend should be organised around explicit modules and service
boundaries. The names below are a recommended target layout; preserve
the repository's existing conventions where they are already coherent.

``` text
backend/
└── app/
    ├── api/
    │   └── v1/
    │       ├── auth.py
    │       ├── workspaces.py
    │       ├── workflows.py
    │       ├── agents.py
    │       ├── documents.py
    │       ├── executions.py
    │       └── approvals.py
    ├── core/
    │   ├── config.py
    │   ├── security.py
    │   ├── dependencies.py
    │   └── logging.py
    ├── db/
    │   ├── session.py
    │   ├── models/
    │   └── migrations/
    ├── schemas/
    ├── services/
    │   ├── workspace_service.py
    │   ├── workflow_service.py
    │   ├── execution_service.py
    │   └── approval_service.py
    ├── orchestration/
    │   ├── graph.py
    │   ├── state.py
    │   ├── nodes/
    │   └── routing.py
    ├── agents/
    │   ├── registry.py
    │   └── implementations/
    ├── rag/
    │   ├── ingestion.py
    │   ├── chunking.py
    │   ├── embeddings.py
    │   ├── vector_store.py
    │   └── retriever.py
    ├── integrations/
    │   └── mcp/
    └── main.py
```

**API routers** should handle HTTP concerns: parsing, authentication
dependencies, response codes, and schema validation. **Services** should
implement application use cases. **Repositories** or data-access modules
should isolate database queries. **Graph nodes** should implement
bounded execution steps and should not import FastAPI request objects or
depend on browser-specific state.

### Orchestration model

A LangGraph workflow is modelled around a shared, typed state. Each node
receives the state it needs and returns a partial state update. Edges
define the execution order; conditional edges route based on explicit
state fields or validated decisions.

A production-oriented state should avoid storing secrets or
unnecessarily large document payloads. Prefer stable identifiers and
bounded structured data:

``` python
from typing import Any, Literal, TypedDict

class WorkflowState(TypedDict, total=False):
    run_id: str
    thread_id: str
    workspace_id: str
    user_id: str
    objective: str
    plan: list[dict[str, Any]]
    retrieved_context: list[dict[str, Any]]
    agent_outputs: dict[str, Any]
    pending_approval_id: str | None
    status: Literal[
        "running",
        "awaiting_approval",
        "completed",
        "failed",
        "cancelled",
    ]
    final_output: dict[str, Any] | None
    error: dict[str, Any] | None
```

The exact state schema should be versioned alongside graph definitions.
Node outputs should be validated before downstream nodes consume them.
External tool calls should have explicit timeouts, bounded retries, and
idempotency controls where repeated execution could cause side effects.

### Persistence strategy

STARK has three distinct persistence requirements:

1.  **Application persistence:** users, workspaces, workflow
    definitions, agent configuration, run metadata, approval records,
    and execution events.
2.  **Graph checkpoint persistence:** LangGraph state snapshots
    associated with a thread so interrupted workflows can be resumed.
3.  **Knowledge persistence:** documents, chunks, embedding vectors, and
    retrieval metadata.

Supabase PostgreSQL is the target application database. LangGraph's
PostgreSQL checkpointer can be used for graph checkpoint persistence,
subject to compatibility and connection configuration. The checkpoint
schema and application schema should be treated as separate concerns,
even when hosted by the same PostgreSQL project.

Do not assume that storing a `workflow_runs` row is equivalent to
checkpointing the graph. A run row is useful for product queries; a
checkpointer stores the graph state required to resume execution.

### RAG and pgvector

The retrieval pipeline follows this sequence:

1.  Validate upload permissions and file constraints.
2.  Extract text and retain source-level provenance.
3.  Split text into chunks using a documented strategy.
4.  Generate embeddings with a configured model.
5.  Store each chunk, its metadata, and its embedding.
6.  Query with an embedding generated by the same embedding space.
7.  Apply workspace and document filters before returning context.
8.  Return chunk text with source identifiers and similarity
    information.

A conceptual pgvector schema is shown below. The vector dimension is
illustrative and **must match the selected embedding model**. Do not
copy `1536` without verifying the model's output dimension.

``` sql
create extension if not exists vector with schema extensions;

create table public.document_chunks (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    document_id uuid not null references public.documents(id) on delete cascade,
    chunk_index integer not null,
    content text not null,
    embedding extensions.vector(1536),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    unique (document_id, chunk_index)
);

create index document_chunks_workspace_idx
    on public.document_chunks (workspace_id);

create index document_chunks_embedding_hnsw_idx
    on public.document_chunks
    using hnsw (embedding vector_cosine_ops);
```

The SQL assumes that `workspaces` and `documents` exist and that the
extension is installed in the `extensions` schema. Adjust the vector
dimension and schema according to the actual Supabase project and
migration conventions.

A similarity query using cosine distance can be implemented as a SQL
function or repository query:

``` sql
select
    id,
    document_id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
from public.document_chunks
where workspace_id = query_workspace_id
order by embedding <=> query_embedding
limit match_count;
```

In production, enforce workspace access in the database and service
layer. Do not rely on a caller-supplied `workspace_id` as proof of
permission. Consider HNSW index behaviour, metadata-filter selectivity,
recall/latency trade-offs, embedding model changes, and re-indexing
strategy as the corpus grows. Supabase's pgvector guidance documents
supported distance operators and HNSW/IVFFlat index options.

### Identity and tenant isolation

Supabase Auth is the intended identity provider. The browser obtains a
user session; the API receives the access token as a bearer token; the
backend verifies the token signature and claims using the supported
Supabase verification approach; then it resolves the user's permissions
for the requested workspace and resource.

For every workspace-owned object, enforce the same ownership boundary
consistently:

-   A user can only read or mutate workspaces in which they have
    membership.
-   Workflow, agent, document, run, and approval queries must be scoped
    through the authorised workspace.
-   RLS policies should protect tables exposed to user-scoped database
    access.
-   The service-role credential must be restricted to trusted
    server-side code and must never be returned to clients.
-   Roles and privileged claims must be managed server-side, not
    accepted from arbitrary user-editable profile metadata.

The application layer and RLS should complement each other. RLS is not a
substitute for clear service-level authorisation, and service-role
access can bypass policies; privileged operations therefore require
explicit checks.

### MCP integration and tool security

MCP should be treated as a protocol boundary, not as an automatic trust
grant. A connected server may expose tools, resources, or prompts; STARK
remains responsible for deciding which workflow or agent can access each
capability.

A tool invocation should pass through the following controls:

-   **Discovery allowlist:** only configured servers and capabilities
    are eligible.
-   **Identity:** use the correct transport authentication and server
    identity configuration.
-   **Authorisation:** check workspace, workflow, agent, and user policy
    before invocation.
-   **Schema validation:** validate tool arguments and constrain payload
    size.
-   **Execution limits:** apply timeouts, concurrency limits, and
    bounded retries.
-   **Side-effect policy:** classify read-only and mutating tools;
    require approval for sensitive actions.
-   **Auditability:** record the caller, tool name, input reference,
    outcome, duration, and error category without logging secrets.

Never pass raw model-generated arguments directly to a privileged tool
without validation and policy checks.

### Execution observability

A workflow should emit structured events for lifecycle transitions and
meaningful node activity. At minimum, capture:

-   Run identifier, workflow identifier, workspace identifier, and graph
    version.
-   Node or agent name, event type, and timestamps.
-   Start, completion, retry, pause, resume, and failure events.
-   Token and model usage when provider metadata makes it available.
-   Tool invocation metadata and result status.
-   Approval request and decision metadata.
-   Error category and safe diagnostic context.

Keep high-volume traces and large model payloads out of hot relational
tables where possible. Store references to detailed traces or artefacts,
apply retention policies, and redact secrets and sensitive document
content from logs. Metrics should distinguish successful completion from
a run that merely returned an HTTP acceptance response.

## Repository layout

The upstream repository is organised around a backend service, a
React/Vite frontend, tests, Docker configuration, and project
documentation. The following is a high-level orientation; verify the
current branch for exact filenames.

``` text
stark/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── services/
│   │   └── ...
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── test/
│   └── package.json
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

The recommended target backend layout in [Backend
boundaries](#backend-boundaries) is an architectural direction, not a
statement that those exact modules already exist.

## Local development

### Prerequisites

-   Git
-   Docker Desktop with Docker Compose
-   Python version supported by the backend dependency files
-   Node.js version supported by the frontend package configuration
-   A Supabase project for the target persistence and authentication
    integrations
-   Credentials for a supported LLM and embedding provider when testing
    real model execution

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR_ORG/stark.git
cd stark
```

Replace the repository address with the actual STARK remote.

### 2. Configure environment

On PowerShell:

``` powershell
Copy-Item .env.example .env
```

On macOS/Linux:

``` bash
cp .env.example .env
```

Review the variables in `.env.example` and configure only the
integrations currently supported by the checked-out branch. Do not
commit `.env`.

### 3. Start the local stack

If the repository's Docker Compose configuration is available and
configured:

``` bash
docker compose up --build -d
docker compose ps
```

Inspect service logs:

``` bash
docker compose logs -f
```

Stop the stack without deleting named volumes:

``` bash
docker compose down
```

Do not use `docker compose down -v` unless you intend to remove the
associated persistent volumes.

### 4. Open the services

The inherited project documentation identifies these local development
addresses; confirm the actual port mappings in `docker-compose.yml`:

-   Frontend: `http://localhost:5173`
-   FastAPI Swagger UI: `http://localhost:8000/docs`
-   OpenAPI schema: `http://localhost:8000/openapi.json`
-   Health check: `http://localhost:8000/api/v1/health`

### 5. Verify tests

Backend:

``` bash
python -m pytest backend/tests -q
```

Frontend:

``` bash
cd frontend
npm install
npm test
npm run build
```

Use the scripts defined by the current `package.json`; test commands can
differ between branches.

## Configuration

The table below lists configuration categories, not guaranteed variable
names. The authoritative names and defaults are those in the current
`.env.example` and application settings module.

  -----------------------------------------------------------------------
  Configuration                       Purpose
  ----------------------------------- -----------------------------------
  Supabase project URL                Identifies the Supabase project

  Supabase publishable / anon key     Public client configuration,
                                      subject to RLS

  Supabase secret / service-role key  Privileged server-side operations
                                      only

  PostgreSQL connection URL           SQLAlchemy, psycopg, and/or
                                      LangGraph checkpointer connectivity

  JWT verification configuration      Verifies user access tokens

  LLM provider and model              Selects the generation provider and
                                      model

  LLM API credential                  Authenticates the selected model
                                      provider

  Embedding provider and model        Generates query and document
                                      embeddings

  Embedding dimension                 Must match the pgvector column
                                      dimension

  MCP server configuration            Defines permitted MCP endpoints and
                                      credentials

  Application secret and CORS origins Protects application configuration
                                      and browser access
  -----------------------------------------------------------------------

Use separate credentials and projects for local development, staging,
and production where practical. Rotate exposed credentials immediately.
Keep secrets in deployment secret stores rather than source control.

## API surface

FastAPI generates an OpenAPI specification from the actual route and
schema definitions. The generated document is the source of truth for
the current API contract.

The product API is expected to be organised around these resource
groups:

-   **Identity:** current user and session validation.
-   **Workspaces:** workspace creation, membership, and access.
-   **Agents:** agent configuration and capability selection.
-   **Workflows:** workflow definitions, versions, and validation.
-   **Executions:** run submission, status, event history, and result
    retrieval.
-   **Approvals:** pending requests, decisions, and authorised
    resumption.
-   **Documents:** upload registration, ingestion status, and document
    lifecycle.
-   **Evaluation:** benchmark execution, metrics, reports, and
    comparisons.

Do not treat this list as a declaration that every endpoint is
implemented. Inspect `/openapi.json` on the running branch for exact
paths, methods, request models, response models, and authentication
requirements.

## Quality, evaluation, and testing

A multi-agent platform needs tests at several levels. A passing unit
test suite does not by itself demonstrate retrieval quality, model
reliability, or safe tool execution.

**Unit tests** should cover state transformations, node contracts,
chunking, metadata validation, authorization helpers, and service-level
business rules.

**Integration tests** should cover database migrations, RLS behaviour,
pgvector queries, JWT verification, checkpointer setup, and API-to-graph
execution.

**Workflow tests** should exercise successful completion, conditional
routing, tool failure, bounded retry, approval pause, approval
rejection, resume, cancellation, and recovery after process restart.

**Retrieval evaluation** should use a labelled dataset and report
metrics such as Recall@k, Precision@k, Mean Reciprocal Rank, and Mean
Average Precision where applicable. Evaluate the impact of chunk size,
overlap, embedding model, metadata filters, and index configuration.

**Generation evaluation** should assess groundedness, factual coverage,
citation correctness, task completion, policy adherence, and refusal
behaviour. Use deterministic checks where possible and human review for
qualitative outcomes.

**Operational tests** should measure latency, concurrency, database
connection saturation, provider rate limits, queue depth if a queue is
introduced, and behaviour under partial dependency failure.

Every benchmark report should record the dataset version, workflow
version, prompt version, model provider, model identifier, embedding
model, retrieval parameters, and timestamp. Never present mock-provider
output as evidence of real-model performance.

## Security and operational considerations

STARK processes user documents and may invoke external tools. Its
security model must therefore cover both data access and execution
authority.

-   Enforce authentication and workspace authorisation on every
    protected endpoint.
-   Apply RLS to workspace-owned data where database access paths permit
    it.
-   Keep service-role keys, model credentials, and MCP secrets on the
    server.
-   Validate uploads by content type, file size, parser limits, and
    access policy.
-   Treat retrieved document content as untrusted input; it must not
    override system policy or tool permissions.
-   Validate structured model outputs before using them in downstream
    nodes.
-   Apply allowlists, timeouts, rate limits, and argument schemas to
    tools.
-   Require human approval for configured high-impact or irreversible
    actions.
-   Use idempotency keys or deduplication for retried operations with
    side effects.
-   Redact credentials and sensitive content from logs and traces.
-   Define retention, deletion, backup, and restore procedures for
    application data and checkpoints.
-   Pin and regularly update dependencies; scan images and packages for
    known vulnerabilities.

The platform should not claim that prompt instructions alone prevent
prompt injection or unsafe tool use. Security decisions must be enforced
in code and at the data and integration boundaries.

## Impact and benefits

STARK is designed to improve the engineering and operational
characteristics of AI-assisted workflows:

**Reduced integration overhead.** Teams can compose reusable agent and
tool capabilities within a common execution model rather than repeatedly
wiring independent scripts together.

**Inspectable execution.** Run identifiers, stage events, state
transitions, and persisted outputs make it easier to understand what
happened during a workflow.

**Controlled autonomy.** Approval boundaries and tool policies allow
teams to decide which steps can run automatically and which require
review.

**Grounded outputs.** Workspace-scoped retrieval gives workflows access
to relevant internal material with source metadata that can be surfaced
for inspection.

**Recoverable workflows.** Checkpoint-backed execution can support
pause, resume, and recovery patterns when configured and tested
correctly.

**A consistent application foundation.** Identity, workspaces, workflow
definitions, documents, runs, and approvals share a common application
and data model.

These are intended product benefits. Quantified time savings, accuracy
improvements, and reliability gains require measurement against a
defined baseline and representative workload.

## Market context and scalability

The market for AI workflow infrastructure includes several adjacent
categories:

-   **Visual automation platforms** such as n8n provide workflow
    composition and integrations, including AI-oriented nodes and human
    review patterns.
-   **Agent orchestration frameworks** such as LangGraph provide
    low-level primitives for stateful, controllable agent execution.
-   **Durable execution platforms** such as Temporal focus on reliable
    workflow execution across process and infrastructure failures.
-   **Managed database and application platforms** such as Supabase
    provide PostgreSQL, authentication, storage, and database extensions
    such as pgvector.

These categories overlap but are not interchangeable. A workflow
builder, an agent runtime, a durable execution engine, and a managed
database solve different layers of the problem. STARK's product position
is an application layer that combines agent workflow orchestration with
workspace-aware knowledge retrieval, execution inspection, and human
approval.

### Scalability strategy

Scalability should be introduced through measured bottleneck removal
rather than premature service decomposition.

1.  **Stateless API instances:** keep request handling stateless and
    move durable state to PostgreSQL and the graph checkpointer.
2.  **Separate execution from request handling:** use a controlled
    worker or task-dispatch model for long-running workflows. Select
    queue infrastructure only when workload and operational requirements
    justify it.
3.  **Bound concurrency:** limit simultaneous graph runs, model calls,
    and tool invocations per user, workspace, and provider.
4.  **Pool database connections:** configure separate, bounded
    connection pools for API and checkpoint workloads; account for
    Supabase connection limits and pooling modes.
5.  **Index retrieval deliberately:** begin with exact search for small
    datasets, then benchmark HNSW or IVFFlat as corpus size and latency
    requirements grow.
6.  **Partition by access pattern:** apply workspace filters and
    appropriate relational indexes; consider partitioning only when
    volume and query patterns warrant it.
7.  **Cache selectively:** cache stable configuration and non-sensitive
    metadata; avoid caching permission-sensitive retrieval results
    without a correct tenant-aware key.
8.  **Observe before optimising:** measure API latency, graph duration,
    node duration, token usage, vector query latency, queue depth, and
    error rates.
9.  **Version the knowledge pipeline:** record embedding model and
    chunking versions so re-indexing and retrieval comparisons are
    reproducible.
10. **Plan for provider failure:** use bounded retries, timeouts,
    circuit-breaking where appropriate, and explicit terminal failure
    states.

STARK should be benchmarked with realistic concurrent users, document
volumes, workflow lengths, and tool failure scenarios before making
throughput or availability claims.

## Engineering and release discipline

STARK's release process validates the complete application path, from authenticated request intake through graph execution, retrieval, tool invocation, approval, persistence, and result delivery.

Each release is checked across the following engineering areas:

- **Architecture integrity:** service boundaries, dependency compatibility, and configuration consistency.
- **Data integrity:** schema migrations, referential constraints, workspace isolation, and backup/restore behaviour.
- **Workflow correctness:** graph routing, typed state transitions, checkpoint recovery, retries, cancellation, and terminal-state handling.
- **Retrieval quality:** embedding compatibility, chunk provenance, metadata filtering, index behaviour, and benchmark evaluation.
- **Security controls:** JWT verification, resource authorisation, RLS policies, secret handling, upload validation, and tool permission enforcement.
- **Operational readiness:** structured logs, execution metrics, dependency health, resource limits, and failure recovery.

The release artefact includes the application version, database migration version, workflow definitions, dependency lockfiles, and environment configuration reference. Changes to prompts, graph topology, models, or embedding configuration are versioned so that execution results can be interpreted against the configuration that produced them.

## Research and references

The architecture is informed by primary documentation and the upstream
implementation. These references are included for technical
verification; they are not endorsements or claims of partnership.

### Project foundation

-   [Upstream multi-agent workflow
    platform](https://github.com/chargedleo/multi-agent-workflow-platform)
    --- source repository used as the starting point. Review its current
    branch, dependency files, licence, and implementation before
    modifying or redistributing it.

### Orchestration and persistence

-   [LangGraph
    overview](https://docs.langchain.com/oss/python/langgraph/overview)
    --- graph-based orchestration, stateful agents, streaming, and
    human-in-the-loop execution.
-   [LangGraph
    persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
    --- checkpoints, thread-scoped state, stores, and persistence
    concepts.
-   [LangGraph PostgreSQL
    checkpointer](https://github.com/langchain-ai/langgraph/tree/main/libs/checkpoint-postgres)
    --- PostgreSQL-backed checkpoint implementation.

### Database, vectors, and identity

-   [Supabase: Vector
    columns](https://supabase.com/docs/guides/ai/vector-columns) ---
    storing and querying embeddings in PostgreSQL.
-   [Supabase:
    pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
    --- vector similarity and extension usage.
-   [Supabase: Vector
    indexes](https://supabase.com/docs/guides/ai/vector-indexes) ---
    HNSW and IVFFlat indexing.
-   [Supabase Auth](https://supabase.com/docs/guides/auth) --- identity,
    JWTs, and integration with database access.
-   [Supabase Row Level
    Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
    --- database-level authorisation policies.

### API, interoperability, and workflow reliability

-   [FastAPI documentation](https://fastapi.tiangolo.com/) --- API
    routing, dependency injection, validation, and OpenAPI.
-   [Model Context Protocol
    architecture](https://modelcontextprotocol.io/docs/learn/architecture)
    --- host, client, server, tools, resources, and protocol boundaries.
-   [Temporal documentation](https://docs.temporal.io/) --- durable
    execution concepts and workflow reliability patterns.
-   [GitHub: Creating
    diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
    --- Mermaid diagrams in GitHub Markdown.

### Market context

-   [n8n documentation](https://docs.n8n.io/) --- workflow automation
    and integration platform.
-   [LangGraph](https://www.langchain.com/langgraph) --- agent
    orchestration runtime and execution capabilities.
-   [Temporal](https://temporal.io/) --- durable execution platform.

## Acknowledgements and licensing

STARK builds on an existing open-source project. The upstream repository
and its authors must be credited, and all inherited code must be used in
accordance with the licence and notices included in that repository.
Review the upstream `LICENSE` and preserve required copyright and
attribution notices before distributing modified versions.

New STARK-specific code should have its licensing terms stated
explicitly by the maintainers. Do not imply that inherited components
were originally authored by the STARK team.

---

::: {align="center"}
**STARK**

*Make complex AI workflows executable, inspectable, and controllable.*
:::
