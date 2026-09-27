//! `terrarium-core`: shared domain types, error codes, and the environment state-machine skeleton.
//!
//! Scope boundary: this crate contains **no** I/O, **no** orchestration, and **no** adapter-specific logic. 
//! It only defines the versioned shapes that `runtime-api`, `terrarium-host`, `terrarium-api`, and `packages/ui-sdk` all agree on. 
//! Anything that talks to a real Microsandbox VM, a database, or the filesystem belongs in a downstream crate.
//!
//! Breaking changes to any type here must bump the relevant schema version under `proto/` and go through a migration.

pub mod error;
pub mod ids;
pub mod schema;
pub mod state_machine;

/// Convenience re-exports for downstream crates and codegen (`quicktype` / `typeshare` reading this crate to produce `packages/ui-sdk` types).
pub mod prelude {
    pub use crate::error::*;
    pub use crate::ids::*;
    pub use crate::schema::*;
    pub use crate::state_machine::*;
}