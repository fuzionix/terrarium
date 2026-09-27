//! Versioned wire schema. 
//! 
//! Everything under this module is what `terrarium-api`, the Tauri IPC layer, and `packages/ui-sdk` serialize across the boundary. 
//! Breaking changes here require a version bump under `proto/environment-contract` or `proto/review-protocol`.

mod environment;
mod event;
mod snapshot;
mod tool;

pub use environment::*;
pub use event::*;
pub use snapshot::*;
pub use tool::*;