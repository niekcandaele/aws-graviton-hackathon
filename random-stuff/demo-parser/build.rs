extern crate protoc_rust;

fn main() {
    protoc_rust::Codegen::new()
        .out_dir("src/csgoprot")
        .inputs(&[
            "protos/steammessages.proto",
            "protos/cstrike15_gcmessages.proto",
            "protos/cstrike15_usermessages.proto",
            "protos/engine_gcmessages.proto",
            "protos/netmessages.proto",
        ])
        .include("protos")
        .run()
        .expect("protoc")
}
