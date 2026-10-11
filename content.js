/* RUSTFORGE v2 curriculum — pure data, engine lives in index.html */
"use strict";
const P=t=>({k:'p',t});
const H=t=>({k:'h',t});
const UL=items=>({k:'ul',items});
const C=(code,cap)=>({k:'code',code,cap});
const TIP=t=>({k:'note',ic:'🦀',cls:'tip',t});
const WARN=t=>({k:'note',ic:'⚠️',cls:'warn',t});
const BOSS=t=>({k:'note',ic:'👑',cls:'boss',t});
const Q=(q,opts,ai,hint)=>({k:'mcq',q,opts,ai,hint,xp:25});
const F=(q,code,answers,hint)=>({k:'fill',q,code,answers,hint,xp:35});
const PR=(q,code,expect,hint)=>({k:'predict',q,code,expect:Array.isArray(expect)?expect:[expect],hint,xp:30});
const T=(q,starter,checker,hint)=>({k:'type',q,starter,checker,hint,xp:60});
const O=(q,lines,hint)=>({k:'order',q,lines,hint,xp:40});

window.RF={RANKS:[
{n:'IGNITION',tag:'Boot the toolchain. Speak your first Rust.',icon:'🔥',lessons:[
 {id:'r0l1',t:'The Crab Awakens',icon:'🦀',min:10,b:[
  P('Every language promises power. Rust makes a different promise: **zero segfaults, zero data races, zero garbage collector** — speed with a guarantee. The compiler is strict, but it is strict *for* you. In this dojo, its errors are your training partners.'),
  TIP('The mascot is a crab named <b>Ferris</b>. Rustaceans — you are one now.'),
  H('Install in one command'),
  C('curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh\nrustc --version\ncargo --version','rustup installs rustc, cargo and rustfmt'),
  P('**cargo** is Rust\u2019s build system, package manager and task runner in one binary. You will type it thousands of times.'),
  C('cargo new robot      # create a project\ncd robot\ncargo run             # compile + execute\ncargo build --release # optimized build','the four horsemen of your daily workflow'),
  Q('What does `cargo new my_bot` create?',
    ['Only a single main.rs file','A project directory with Cargo.toml, src/main.rs and a git repo','A compiled executable immediately','A Docker container'],1,
    'Cargo scaffolds a full project: manifest (Cargo.toml) + src/main.rs.'),
  PR('You run `cargo run` in a fresh project. What appears on stdout?',
    'fn main() {\n    println!("Hello, world!");\n}','Hello, world!','The default main.rs prints exactly that.')
 ]},
 {id:'r0l2',t:'Hello, Ferris',icon:'🖨️',min:12,b:[
  P('Rust programs start at `fn main`. `println!` (with a `!` — it\u2019s a **macro**, not a function) writes a line to stdout. Statements end with `;`.'),
  C('fn main() {\n    println!("Hello, {}!", "Ferris");   // {} is a placeholder\n    println!("2 + 2 = {}", 2 + 2);\n    print!("no newline here");\n}','{} slots are filled positionally'),
  P('Comments start with `//`. Doc comments `///` generate beautiful HTML docs via `cargo doc`.'),
  T('Print the greeting <code>Hello, Ferris!</code> exactly, from inside <code>main</code>.',
    'fn main() {\n    // your println! goes here\n}\n','hello','println!("Hello, Ferris!"); — mind the comma and the !'),
  Q('Why does `println` end with `!`?',
    ['It panics on failure','It is a macro — code that generates code at compile time','It prints in bold','It is asynchronous'],1,'Macros are invoked with ! and expand into regular Rust before compilation.')
 ]},
 {id:'r0l3',t:'Mutability',icon:'🔓',min:12,b:[
  P('Variables are **immutable by default**. This is Rust\u2019s first radical choice: change must be *opted into* with `mut`. When the compiler sees you mutating an immutable binding, it refuses — and tells you exactly how to fix it.'),
  C('fn main() {\n    let x = 5;          // immutable\n    // x = 6;           // ❌ compile error!\n    let mut y = 5;      // mutable\n    y = y + 1;\n    println!("{}", y);  // 6\n}'),
  P('**Shadowing** lets you re-declare the same name with `let` — even changing its type. The old binding simply goes out of scope.'),
  PR('What does this print?',
    'fn main() {\n    let x = 5;\n    let x = x + 1;\n    let x = x * 2;\n    println!("{}", x);\n}','12','Follow each shadow: 5 → 6 → 12.'),
  T('The compiler is angry: <code>cannot assign to `count` because it is immutable</code>. Run it, read the error, fix it, make it print <code>11</code>.',
    'fn main() {\n    let count = 5;\n    count = count + 6;\n    println!("{}", count);\n}\n','mutfix','The error message literally suggests the fix — add one keyword.'),
  F('Declare a constant for the fusion loop rate (constants are SCREAMING_SNAKE and need a type):',
    '___ LOOP_HZ: u32 = 200;',[['const','pub const']],'Constants require a type annotation.')
 ]},
 {id:'r0l4',t:'Scalar Arsenal',icon:'🧮',min:12,b:[
  P('Four scalar families: **integers** (`i8…i128`, `u8…u128`, `isize/usize`), **floats** (`f32`, `f64`), **bool**, and **char** (4 bytes — full Unicode, not a byte).'),
  C('let heart: i32 = 0xFF_6B_2C;   // hex, underscores welcome\nlet pi: f64 = 3.14159;\nlet alive: bool = true;\nlet crab: char = \'🦀\';'),
  WARN('Integer overflow panics in debug builds and wraps in release. Use <code>checked_add</code> in safety-critical robot code — a rolled counter in a motor controller is a fire.'),
  PR('Rust integer division truncates. What prints?',
    'fn main() {\n    let a = 7;\n    let b = 2;\n    println!("{}", a / b);\n}','3','7 / 2 = 3.5 → truncated toward zero → 3.'),
  F('Convert a raw IMU reading (i16) into a float for the filter:',
    'let raw: i16 = 1024;\nlet scaled: f64 = raw ___ f64;',[['as']],'The cast keyword is `as`.')
 ]}
]},
{n:'OWNERSHIP DOJO',tag:'The heart of Rust. Master this and everything else follows.',icon:'⛩️',lessons:[
 {id:'r1l1',t:'Ownership',icon:'🔑',min:15,b:[
  P('Three laws, enforced at compile time, no runtime cost:'),
  UL(['Every value has exactly one **owner**.','When the owner goes out of scope, the value is **dropped** (freed).','Assigning or passing a value **moves** it — the old name is dead.']),
  C('fn main() {\n    let s1 = String::from("lidar");\n    let s2 = s1;            // MOVE: s1 is now invalid\n    // println!("{}", s1);  // ❌ error[E0382]: value borrowed after move\n    println!("{}", s2);     // ✅\n}'),
  P('This single rule deletes entire bug classes: double frees, use-after-free, dangling pointers. Garbage collectors solve this with runtime cost; Rust solves it with *math at compile time*.'),
  PR('What does the compiler say about this?',
    'fn main() {\n    let s1 = String::from("ferris");\n    let s2 = s1;\n    println!("{}", s1);\n}',['error[e0382]: borrow of moved value: `s1`','compile error: value moved','error: s1 moved','borrow of moved value'],'It does NOT run — any answer mentioning move/E0382/compile error passes.'),
  Q('When is a heap value freed?',
    ['When the GC feels like it','When its owner goes out of scope','Manually with delete()','Never'],1,'Deterministic drop — this is why Rust has no GC and no leaks by default.'),
  F('Force a real copy of heap data instead of a move:',
    'let s1 = String::from("imu");\nlet s2 = s1.___();',[['clone','clone()']],'clone() duplicates heap data; plain = would move.')
 ]},
 {id:'r1l2',t:'Borrowing',icon:'🤝',min:15,b:[
  P('You rarely want to give values away. **References** (`&`) let functions *look* without taking. Rules of the dojo:'),
  UL(['Any number of shared borrows `&T` ✅','Exactly one mutable borrow `&mut T` ✅','Both at once ❌ — this is the data-race firewall.']),
  C('fn length(s: &String) -> usize { s.len() }   // borrows\n\nfn shout(s: &mut String) { s.push_str("!!!"); }\n\nfn main() {\n    let mut word = String::from("rust");\n    let l = length(&word);      // shared borrow\n    shout(&mut word);           // exclusive borrow\n    println!("{} ({})", word, l);\n}'),
  TIP('“Either many readers, or one writer — never both.” Enforced for threads too. This is the secret behind <b>fearless concurrency</b> in Rank 5.'),
  Q('Which combination is ILLEGAL?',
    ['Two &T borrows','One &mut T borrow','One &T and one &mut T at the same time','No borrows'],2,'Aliasing + mutation = dangling reads. Rust forbids it statically.'),
  F('Fix the signature so the caller keeps the vector:',
    'fn total(v: ___<i32>) -> i32 {\n    let mut s = 0;\n    for x in v { s = s + x; }\n    s\n}',[['&Vec','& Vec']],'Pass by shared reference: &Vec<i32>.')
 ]},
 {id:'r1l3',t:'Slices',icon:'🔪',min:12,b:[
  P('A **slice** is a borrowed view into a sequence: `&[T]` for arrays/vectors, `&str` for strings. Zero copies, just a pointer + length.'),
  C('fn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &b) in bytes.iter().enumerate() {\n        if b == b\' \' { return &s[0..i]; }\n    }\n    s\n}'),
  Q('A `&str` slice contains…',
    ['An owned copy of the string','A pointer into existing string data + a length','A GC handle','A file descriptor'],1,'Fat pointer: (ptr, len). This is why &str is the preferred string parameter.'),
  PR('What prints?',
    'fn main() {\n    let v = vec![10, 20, 30, 40];\n    let mid = &v[1..3];\n    println!("{}", mid.len());\n}','2','1..3 is half-open: elements at index 1 and 2 → length 2.')
 ]},
 {id:'r1l4',t:'String vs &str',icon:'🧵',min:10,b:[
  P('The classic rite of passage. `String` = owned, growable, heap buffer. `&str` = borrowed view of UTF-8. Rule of thumb: **own in structs, borrow in function parameters**.'),
  C('struct Scan {\n    label: String,        // owns its data\n}\n\nfn report(label: &str) {  // borrows: accepts String AND &str\n    println!("scanning: {}", label);\n}\n\nfn main() {\n    let scan = Scan { label: String::from("lidar") };\n    report(&scan.label);  // &String coerces to &str\n    report("imu");        // literals are &\'static str\n}'),
  Q('A string literal like "ferris" has type…',
    ['String','&\'static str','char[]','Box<str>'],1,'Literals are baked into the binary and live forever.'),
  F('Build an owned greeting from a slice:',
    'let name = "ferris";\nlet owned: String = name.___();',[['to_string','to_string()','into']],'to_string() / .into() / String::from all produce an owned String.')
 ]}
]},
{n:'STRUCTURE & CONTROL',tag:'Model the world. Branch like a compiler.',icon:'🧱',lessons:[
 {id:'r2l1',t:'Control Flow',icon:'🔀',min:12,b:[
  P('Almost everything in Rust is an **expression** — `if`, `match`, even blocks return values. `loop` can hand a value back through `break`.'),
  C('fn main() {\n    let mut n = 5;\n    while n > 0 { println!("{}", n); n = n - 1; }\n\n    for i in 0..3 { println!("tick {}", i); }\n\n    let x = loop { break 7; };      // loop as expression!\n    let sign = if x > 0 { 1 } else { -1 };\n    println!("{} {}", x, sign);\n}'),
  PR('What does this print?',
    'fn main() {\n    let answer = loop {\n        break 6 * 7;\n    };\n    println!("{}", answer);\n}','42','break with a value returns it from the loop expression.'),
  T('Classic countdown: print 5,4,3,2,1 on separate lines, then <code>Liftoff!</code> — using a loop.',
    'fn main() {\n    // count down from 5, then print Liftoff!\n}\n','countdown','let mut n = 5; while n > 0 { println!("{}", n); n = n - 1; } println!("Liftoff!");'),
  Q('`for i in 0..5` iterates over…',
    ['0,1,2,3,4,5','0,1,2,3,4','1,2,3,4,5','only 0'],1,'.. is half-open: 0..=5 would include 5.')
 ]},
 {id:'r2l2',t:'Structs',icon:'📦',min:14,b:[
  P('Structs bundle named fields. `impl` blocks attach methods; `&self` borrows the instance, `&mut self` mutates, `self` consumes.'),
  C('struct Imu {\n    accel: f64,\n    gyro: f64,\n    calibrated: bool,\n}\n\nimpl Imu {\n    fn new() -> Imu { Imu { accel: 0.0, gyro: 0.0, calibrated: false } }\n    fn calibrate(&mut self) { self.calibrated = true; }\n    fn reading(&self) -> f64 { self.accel + self.gyro }\n}'),
  Q('What does `&mut self` as first parameter mean?',
    ['The method may mutate the instance','The method consumes the instance','The method is static','The method is async'],0,'&self = read, &mut self = write, self = consume.'),
  F('Complete the constructor signature:',
    'impl Pose {\n    fn origin() -> ___ { Pose { x: 0.0, y: 0.0 } }\n}',[['Pose']],'The return type is the struct itself.')
 ]},
 {id:'r2l3',t:'Enums & Match',icon:'🎰',min:15,b:[
  P('Enums are Rust\u2019s superpower: variants that carry **data**. `match` must cover every possibility — the compiler literally refuses incomplete reasoning.'),
  C('enum SensorMode { Idle, Scanning(u32), Fault(String) }\n\nfn describe(m: SensorMode) -> String {\n    match m {\n        SensorMode::Idle        => String::from("idle"),\n        SensorMode::Scanning(hz)=> format!("scanning at {} Hz", hz),\n        SensorMode::Fault(code) => format!("fault: {}", code),\n    }\n}'),
  TIP('Match arms support <b>range patterns</b> (90..=100), literals and bindings. The in-browser RustLite compiler runs them — prove it in the quest below.'),
  T('Write <code>fn grade(score: i32)</code> with <code>match</code>: 90..=100 → "A", 80..=89 → "B", 70..=79 → "C", _ → "F". Then print grade(95), grade(84), grade(72).',
    'fn grade(score: i32) -> &str {\n    match score {\n        // arms here\n        _ => "F",\n    }\n}\n\nfn main() {\n    println!("{}", grade(95));\n    println!("{}", grade(84));\n    println!("{}", grade(72));\n}\n','grade','Each arm: 90..=100 => "A", and so on. Underscore is the catch-all.'),
  Q('What happens if you forget one match arm?',
    ['Runtime panic','Silent default','Compile error — non-exhaustive match','Undefined behavior'],2,'Exhaustiveness is checked statically. No surprises at 3am.')
 ]},
 {id:'r2l4',t:'Option & Result',icon:'🎁',min:16,b:[
  P('Rust has **no null**. Instead: `Option<T>` = `Some(value)` or `None`, and `Result<T, E>` = `Ok(value)` or `Err(e)`. The `?` operator propagates errors upward — error handling as *data*, not exceptions.'),
  C('fn parse_hz(s: &str) -> Result<f64, String> {\n    match s.parse::<f64>() {\n        Ok(v)  => Ok(v),\n        Err(_) => Err(format!("bad rate: {}", s)),\n    }\n}\n\nfn boot() -> Result<(), String> {\n    let hz = parse_hz("200")?;   // ? returns early on Err\n    println!("filter running at {} Hz", hz);\n    Ok(())\n}'),
  T('RustLite now runs Option! Implement <code>fn find_big(v, limit) -> Option</code>: return the first element above the limit, else None. Match on both calls in main.',
    'fn find_big(v: &[f64], limit: f64) -> Option<f64> {\n    let mut i = 0;\n    while i < v.len() {\n        // if v[i] > limit, return Some(v[i])\n        i = i + 1;\n    }\n    None\n}\n\nfn main() {\n    let scans = [3.1, 9.2, 1.5];\n    match find_big(scans, 5.0) {\n        Some(x) => println!("found: {}", x),\n        None => println!("none"),\n    }\n    match find_big(scans, 10.0) {\n        Some(x) => println!("found: {}", x),\n        None => println!("none"),\n    }\n}\n','optfind','Inside the loop: if v[i] > limit { return Some(v[i]); }'),
  Q('What does `?` do at the end of a Result expression?',
    ['Unwraps or panics always','Returns the Err early from the current function, else yields the Ok value','Converts to Option','Prints the error'],1,'Early-return sugar — the backbone of idiomatic error flow.'),
  F('Extract the value, or fall back to a default:',
    'let safe = maybe_hz.___(100.0);',[['unwrap_or']],'unwrap_or(default) never panics.')
 ]}
]},
{n:'TRAIT FORGE',tag:'Polymorphism without inheritance.',icon:'⚙️',lessons:[
 {id:'r3l1',t:'Generics',icon:'🧬',min:12,b:[
  P('Write once, monomorphized for every type used — **zero-cost** abstraction. The compiler stamps out specialized machine code per concrete type.'),
  C('fn biggest<T>(list: &[T]) -> &T\nwhere T: PartialOrd {\n    let mut best = &list[0];\n    for x in list { if x > best { best = x } }\n    best\n}\n\nstruct Packet<T> { seq: u32, payload: T }'),
  T('Write <code>fn bigger&lt;T&gt;</code> returning the larger of two values. Main must print <code>20</code> then <code>7.5</code> — one function, two types.',
    'fn bigger<T>(a: T, b: T) -> T {\n    // if a > b ...\n}\n\nfn main() {\n    println!("{}", bigger(10, 20));\n    println!("{}", bigger(7.5, 3.0));\n}\n','bigger','if a > b { a } else { b } — one generic fn serves i32 AND f64.'),
  Q('Generic code costs at runtime…',
    ['A vtable lookup per call','Nothing extra — monomorphization inlines concrete versions','Boxing every value','A GC scan'],1,'Monomorphization = compile-time specialization.')
 ]},
 {id:'r3l2',t:'Traits',icon:'🧩',min:14,b:[
  P('A **trait** is a shared behavior contract. Implement it for any type — including ones you don\u2019t own. `#[derive]` auto-implements common ones like `Debug`, `Clone`, `PartialEq`.'),
  C('trait Area { fn area(&self) -> f64; }\n\nstruct Circle { r: f64 }\nstruct Square { s: f64 }\n\nimpl Area for Circle { fn area(&self) -> f64 { 3.14159 * self.r * self.r } }\nimpl Area for Square { fn area(&self) -> f64 { self.s * self.s } }\n\n#[derive(Debug, Clone)]\nstruct Point { x: f64, y: f64 }'),
  F('Bound a function to anything printable:',
    'fn log<T: ___>(item: &T) { println!("{:?}", item); }',[['Debug']],'{:?} formatting requires the Debug trait.'),
  Q('`impl Area for Circle` is an example of…',
    ['Inheritance','Retroactive conformance — implementing a trait for any type','Monkey patching','Template specialization only'],1,'You can even implement YOUR trait on someone else\u2019s type.')
 ]},
 {id:'r3l3',t:'dyn & Dispatch',icon:'🎛️',min:13,b:[
  P('Two ways to be polymorphic: **static** (`impl Trait` / generics — picked at compile time, inlined) and **dynamic** (`dyn Trait` — vtable pointer, chosen at runtime). Heterogeneous collections need `dyn`.'),
  C('trait Sensor { fn read(&self) -> f64; }\nstruct Lidar; struct Radar;\nimpl Sensor for Lidar { fn read(&self) -> f64 { 12.5 } }\nimpl Sensor for Radar { fn read(&self) -> f64 { 8.1 } }\n\nfn main() {\n    let suite: Vec<Box<dyn Sensor>> = vec![Box::new(Lidar), Box::new(Radar)];\n    for s in &suite { println!("{}", s.read()); }\n}'),
  Q('`Box<dyn Sensor>` is sized how?',
    ['Size of the biggest Sensor','Fixed: pointer + vtable pointer; the data lives on the heap','Unknown — cannot compile','Zero'],1,'dyn = fat pointer. Box gives it a stable home on the heap.'),
  PR('What prints, in order?',
    'fn main() {\n    let xs = vec![1, 2, 3];\n    for x in xs { println!("{}", x * x); }\n}','1 4 9','1→1, 2→4, 3→9, each on its own line.')
 ]}
]},
{n:'MEMORY ALCHEMY',tag:'Lifetimes, smart pointers and interior mutability.',icon:'⚗️',lessons:[
 {id:'r4l1',t:'Lifetimes',icon:'⏳',min:15,b:[
  P('Every reference is valid for a **lifetime**. Usually the compiler infers it; when several references interact, you annotate with `'a` — a *promise* that the data outlives the borrow.'),
  C('// returns the longer slice — both inputs must live long enough\nfn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nstruct Filter<\'a> { config: &\'a str }'),
  WARN('The classic error: returning a reference to a local variable. The borrow checker catches a dangling pointer <b>at compile time</b> — a bug class that haunts C robotics codebases.'),
  Q('`&\'a str` reads as…',
    ['A string that owns lifetime a','A borrow of a str guaranteed valid for at least lifetime \u2018a','A mutable string','A string older than a'],1,'Lifetimes describe how long references are valid — nothing changes at runtime.'),
  F('Annotate both the parameter and return so the borrow checker trusts you:',
    'fn first(words: ___ str) -> ___ str { &words[0..1] }',[["&'a","& 'a"],["&'a","& 'a"]],'Both sides share the same lifetime parameter \u2018a.')
 ]},
 {id:'r4l2',t:'Smart Pointers',icon:'📮',min:13,b:[
  P('`Box<T>`: sole owner on the heap. `Rc<T>`: single-threaded shared ownership via ref-counting. `Arc<T>`: the **atomic** version — the one robotics code lives on.'),
  C('use std::sync::Arc;\n\nlet map = Arc::new(String::from("warehouse-A"));\nlet m2 = Arc::clone(&map);   // just bumps the count\n// both point at ONE allocation; freed when count hits 0'),
  Q('Why `Arc` instead of `Rc` when sharing across threads?',
    ['Arc is faster','Arc\u2019s refcount is atomic — safe under concurrent updates','Rc is deprecated','Arc copies the data'],1,'Rc\u2019s non-atomic counter would race.'),
  F('Recursive types need indirection — the size must be finite:',
    'enum Tree { Leaf(i32), Node(Box<Tree>, ___<Tree>) }',[['Box']],'Box<Tree> makes the enum\u2019s size computable.')
 ]},
 {id:'r4l3',t:'Interior Mutability',icon:'🔐',min:12,b:[
  P('Sometimes immutable code must mutate innards: caches, counters, hardware registers. `RefCell<T>` enforces borrow rules **at runtime** (single thread); `Mutex<T>` does the same across threads and hands you the lock.'),
  C('use std::sync::{Arc, Mutex};\n\nlet state = Arc::new(Mutex::new(0));\nlet s2 = Arc::clone(&state);\nstd::thread::spawn(move || {\n    let mut guard = s2.lock().unwrap();\n    *guard += 1;          // mutate through the lock\n});'),
  Q('`Mutex::lock()` returns…',
    ['The value directly','A guard that derefs to the data and unlocks when dropped','A bool','Nothing — it blocks forever'],1,'RAII: the guard IS the unlock. Drop = release, even on panic.'),
  Q('RefCell panics at runtime if…',
    ['You clone it','You break aliasing rules (e.g. two &mut at once)','It crosses threads','It holds a String'],1,'Same rules as the borrow checker — just enforced live.')
 ]}
]},
{n:'FEARLESS CONCURRENCY',tag:'Threads, channels and the end of data races.',icon:'🧵',lessons:[
 {id:'r5l1',t:'Threads',icon:'🕸️',min:12,b:[
  P('`std::thread::spawn` starts an OS thread; `join()` waits and returns its result. The `move` keyword hands owned data to the thread. Ownership *proves* your closures can\u2019t touch freed memory.'),
  C('use std::thread;\n\nfn main() {\n    let handle = thread::spawn(|| {\n        let mut acc = 0.0;\n        for i in 1..=10 { acc = acc + i as f64; }\n        acc\n    });\n    let total = handle.join().unwrap();\n    println!("{}", total);   // 55\n}'),
  Q('What does `move ||` do to a closure?',
    ['Moves it to another CPU','Transfers ownership of captured variables into the closure','Makes it async','Compresses it'],1,'Essential when the closure outlives the scope that made it.'),
  PR('What prints?',
    'fn main() {\n    let h = std::thread::spawn(|| 21 * 2);\n    println!("{}", h.join().unwrap());\n}','42','join() hands back the thread\u2019s return value wrapped in Result.')
 ]},
 {id:'r5l2',t:'Channels',icon:'📡',min:14,b:[
  P('**Share by communicating**. `mpsc::channel()` gives a transmitter and receiver; `send()` moves values in. Dropping the receiver is detected — no silent data loss.'),
  C('use std::sync::mpsc;\nuse std::thread;\n\nlet (tx, rx) = mpsc::channel();\nthread::spawn(move || {\n    let reading = 9.81;\n    tx.send(reading).unwrap();   // moved INTO the channel\n});\nlet v = rx.recv().unwrap();\nprintln!("accel: {}", v);'),
  T('Assemble the pipeline (checked structurally): code containing <code>thread::spawn</code>, <code>mpsc::</code> channel, <code>.send(...)</code> and <code>recv()</code> — send "ping" and print what arrives.',
    'use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    // spawn a thread that sends "ping", then recv + print it\n}\n','threads','thread::spawn(move || tx.send(String::from("ping")).unwrap()); then println!("{}", rx.recv().unwrap());'),
  Q('After `tx.send(value)`, can the sender still use `value`?',
    ['Yes, it is copied','No — send moves it','Only if Clone','Only inside unsafe'],1,'Ownership flows down the channel.')
 ]},
 {id:'r5l3',t:'Mutex + Arc + Send/Sync',icon:'🛡️',min:13,b:[
  P('`Arc<Mutex<T>>` is the canonical shared-state combo. Two marker traits police everything: **Send** (can move between threads) and **Sync** (can be shared between threads). `Rc` is neither — the compiler refuses to compile races.'),
  Q('Which type is NOT Send?',
    ['Arc<Vec<u8>>','Mutex<i32>','Rc<String>','String'],2,'Rc\u2019s non-atomic refcount forbids crossing threads.'),
  Q('Deadlock in Rust is…',
    ['Impossible','A compile error','Possible at runtime — locks don\u2019t prevent bad ordering','Undefined behavior'],2,'The type system stops races, not logic errors.')
 ]},
 {id:'r5l4',t:'Data Parallelism: Rayon',icon:'🌾',min:10,b:[
  P('For embarrassingly parallel work (filtering point clouds, batch inference), **rayon** turns `iter()` into `par_iter()` with work-stealing. No channels, no joins — just iterators.'),
  C('// Cargo.toml: rayon = "1"\nuse rayon::prelude::*;\n\nlet cloud: Vec<f64> = vec![0.1, 0.4, 0.9, 1.6];\nlet total: f64 = cloud.par_iter().map(|p| p * p).sum();'),
  F('One word turns this serial iterator into a parallel one:',
    'let hits: Vec<_> = scans.___()\n    .filter(|s| s.intensity > 0.5)\n    .collect();',[['par_iter','par_iter()']],'rayon\u2019s magic method.')
 ]}
]},
{n:'ASYNC HYPERLOOP',tag:'Thousands of tasks, microsecond budgets.',icon:'⚡',lessons:[
 {id:'r6l1',t:'async / .await',icon:'⏯️',min:13,b:[
  P('An `async fn` compiles to a state machine (a `Future`). Nothing runs until an **executor polls it**. `.await` is a suspension point — the task yields, the runtime runs something else, then resumes.'),
  C('async fn read_lidar() -> Vec<f64> {\n    vec![1.0, 2.0, 3.0]\n}\n\nasync fn pipeline() -> usize {\n    let scan = read_lidar().await;   // suspends until ready\n    scan.len()\n}'),
  Q('Calling an async fn immediately…',
    ['Runs it to completion','Returns a Future — nothing executes until awaited/polled','Spawns a thread','Blocks the OS'],1,'Futures are lazy. This trips every newcomer once.'),
  Q('The default async model is…',
    ['Green threads everywhere','Runtime-agnostic futures + a runtime you choose (tokio, embassy)','Kernel coroutines','Callbacks'],1,'Futures are library types; the executor is pluggable.')
 ]},
 {id:'r6l2',t:'Tokio in the Field',icon:'🌀',min:13,b:[
  P('**tokio**: multi-threaded work-stealing executor, timers, I/O, channels. On a robot: sensor drivers as spawned tasks publishing into channels, fusion ticking at fixed rate.'),
  C('// Cargo.toml: tokio = { version = "1", features = ["full"] }\n#[tokio::main]\nasync fn main() {\n    let imu = tokio::spawn(async { 0.42 });\n    let gps = tokio::spawn(async { 51.5 });\n    let (a, g) = tokio::join!(imu, gps);\n    println!("{} {}", a.unwrap(), g.unwrap());\n}'),
  F('The attribute that wires up the async main:',
    '#[___::main]\nasync fn main() { }',[['tokio']],'#[tokio::main] builds the runtime and blocks on your future.'),
  Q('`tokio::join!` differs from two sequential awaits because…',
    ['It\u2019s just syntax','It runs futures concurrently, interleaving progress','It uses threads implicitly','It ignores errors'],1,'Concurrency at await points.')
 ]},
 {id:'r6l3',t:'Error Alchemy',icon:'🧪',min:12,b:[
  P('Production pattern: library code returns typed errors (`thiserror`), applications convert freely with `?` into one error type (`anyhow::Result`). Libraries: precise. Binaries: ergonomic.'),
  C('// thiserror = "1"   anyhow = "1"\nuse thiserror::Error;\n\n#[derive(Error, Debug)]\nenum SensorErr {\n    #[error("i2c timeout on bus {0}")]\n    Timeout(u8),\n    #[error("bad checksum")]\n    Checksum,\n}\n\nfn run() -> anyhow::Result<()> {\n    let hz = read_imu()?;      // converts automatically\n    Ok(())\n}'),
  Q('`?` on an anyhow::Result works because anyhow\u2019s error implements…',
    ['Clone','From<E> for any E: std::error::Error + Send + Sync \u2018static','Copy','Default'],1,'Blanket From — any standard error converts in.'),
  F('Panic with context when calibration data is missing:',
    'let cfg = fs::read("cal.toml").___("calibration file required");',[['expect']],'expect(msg) = unwrap + your message baked into the panic.')
 ]}
]},
{n:'DARK ARTS',tag:'Unsafe, FFI and macros.',icon:'🕯️',lessons:[
 {id:'r7l1',t:'Unsafe Rust',icon:'☢️',min:13,b:[
  P('`unsafe` unlocks five superpowers (raw pointers, unsafe fns, statics, traits, unions) — it does **not** disable the borrow checker. 99% of robotics Rust is safe; the 1% touches DMA buffers and registers.'),
  C('let mut buf: [u8; 4] = [0; 4];\nlet p: *mut u8 = buf.as_mut_ptr();\nunsafe {\n    *p = 0xFF;\n    *p.add(1) = 0x6B;\n}\nprintln!("{:?}", buf);            // [255, 107, 0, 0]'),
  WARN('unsafe is a contract: YOU now uphold memory safety. Wrap every unsafe block in a safe API with documented invariants.'),
  Q('Which is TRUE about `unsafe`?',
    ['It turns off all checks','It permits raw pointer deref etc., while borrow rules still apply','It makes code faster','It is required for threads'],1,'The checker keeps running; unsafe only ADDS abilities.'),
  F('Dereference a raw pointer (the one keyword required):',
    'let v = ___ { *ptr };',[['unsafe']],'Deref of *const/*mut must live in an unsafe block.')
 ]},
 {id:'r7l2',t:'FFI: Rust ⇄ C',icon:'🔌',min:12,b:[
  P('Vendor SDKs are often C. `extern "C"` declares foreign functions; `#[repr(C)]` matches C layout; `bindgen` generates bindings automatically.'),
  C('#[repr(C)]\nstruct LidarFrame { count: u32, ranges: *const f32 }\n\nextern "C" {\n    fn lidar_next(frame: *mut LidarFrame) -> i32;\n}\n\nfn safe_next() -> Result<i32, ()> {\n    let mut f = LidarFrame { count: 0, ranges: std::ptr::null() };\n    let rc = unsafe { lidar_next(&mut f) };\n    if rc == 0 { Ok(f.count as i32) } else { Err(()) }\n}'),
  Q('Why `#[repr(C)]`?',
    ['Compression','Guarantees C-compatible field layout and alignment','Enables Copy','Marks it unsafe'],1,'Rust\u2019s default layout may reorder fields.'),
  Q('The safe wrapper\u2019s job is to…',
    ['Add speed','Uphold invariants at the boundary so callers never see unsafety','Remove error handling','Inline the C code'],1,'Boundary discipline is the whole game in hardware Rust.')
 ]},
 {id:'r7l3',t:'Macros',icon:'🧙',min:13,b:[
  P('Declarative macros (`macro_rules!`) match token trees — `println!`, `vec!`. Procedural macros are compiler plugins that transform code — `#[derive(Serialize)]`, `#[tokio::main]`.'),
  C('macro_rules! log {\n    ($lvl:expr, $($arg:tt)*) => {\n        println!("[{}] {}", $lvl, format!($($arg)*))\n    };\n}\n\nfn main() { log!("INFO", "filter rate {} Hz", 200); }'),
  F('The keyword that starts a declarative macro definition:',
    '___ robot_log { ($msg:expr) => { println!("{}", $msg) }; }',[['macro_rules!','macro_rules']],'macro_rules! name { pattern => expansion }')
 ]}
]},
{n:'FORGE OF SPEED',tag:'Measure, shave, embed.',icon:'🏎️',lessons:[
 {id:'r8l1',t:'Profiling & Benchmarks',icon:'📈',min:11,b:[
  P('Rule zero: **measure**. `cargo bench` with `criterion` gives statistically sound micro-benchmarks; flamegraphs show hotspots. Your budget is the control period — e.g. 2 ms of every 5 ms.'),
  C('// benches/fusion.rs   criterion = "0.5"\nuse criterion::{criterion_group, criterion_main, Criterion};\n\nfn bench_ekf(c: &mut Criterion) {\n    c.bench_function("ekf_step", |b| b.iter(|| ekf_step()));\n}\ncriterion_group!(benches, bench_ekf);\ncriterion_main!(benches);'),
  Q('The first optimization step should be…',
    ['Rewrite in unsafe','Profile to find the actual hotspot','Add a cache','Increase threads'],1,'Optimizing the wrong 5% is how deadlines die.'),
  Q('`cargo build --release` enables…',
    ['Debug symbols only','Optimizations (opt-level 3, LTO possible)','Slower but safer code','Tests'],1,'Never benchmark debug builds.')
 ]},
 {id:'r8l2',t:'Zero-Cost Iterators',icon:'🪶',min:13,b:[
  P('Iterators compile to the same (often better) code as hand-rolled loops — and RustLite now runs them too: `map`, `filter`, `fold`, closures with `|x| ...`.'),
  T('Iterator gauntlet, live in your browser: starting from <code>signal</code>, keep values above 1.0, double them, and sum. The answer must be <code>15</code>. Use closures.',
    'fn main() {\n    let signal = [0.5, 1.5, 2.5, 3.5];\n    // chain: .iter().filter(|x| ...).map(|x| ...).sum()\n    let boosted = 0.0;\n    println!("{}", boosted);\n}\n','itergauntlet','signal.iter().filter(|x| *x > 1.0).map(|x| x * 2.0).sum() — (1.5+2.5+3.5)*2 = 15.'),
  PR('Same output — what prints?',
    'fn main() {\n    let v = vec![1, 2, 3, 4];\n    let sum: i32 = v.iter().filter(|x| *x > 2).sum();\n    println!("{}", sum);\n}','7','Filter keeps 3 and 4; sum = 7.'),
  F('Avoid re-allocation when you know the size:',
    'let mut frames = Vec::___(1024);',[['with_capacity']],'One allocation instead of many regrows.')
 ]},
 {id:'r8l3',t:'no_std & Embedded',icon:'🔋',min:12,b:[
  P('Strip the standard library, keep the language: `#![no_std]` binaries run on bare metal via `embedded-hal`. Crates like `cortex-m-rtic` give interrupt-driven real-time scheduling.'),
  Q('`no_std` forbids…',
    ['All generics','Heap-dependent std facilities by default (String, Vec need alloc)','Math','Unsafe'],1,'Core + alloc + std are layered.'),
  Q('embedded-hal\u2019s value is…',
    ['Speed only','Portable traits (I2c, Spi, Delay) so drivers work across chips','A GUI toolkit','Cloud sync'],1,'Write the driver once against traits; swap MCUs freely.')
 ]}
]},
{n:'ROBOTICS SYSTEMS',tag:'Where Rust meets the physical world.',icon:'🤖',lessons:[
 {id:'r9l1',t:'Robot Software Anatomy',icon:'🫀',min:14,b:[
  P('A serious robot stack is a set of **rate-loops**: perception (10–30 Hz), estimation/fusion (100–500 Hz), control (500 Hz+), safety monitor (always on). Rust\u2019s determinism and typed message passing fit the hard-timing layers.'),
  O('Order the autonomy pipeline — click lines into the correct sequence:',
    ['1. Read sensors (IMU, GPS, lidar)','2. Time-sync & calibrate raw data','3. Fuse into state estimate (pose, velocity)','4. Plan trajectory / choose action','5. Send actuator commands','6. Log + watchdog check']),
  Q('Why no garbage collector in a 500 Hz control loop?',
    ['GC is slow always','GC pauses are unpredictable — jitter breaks control stability','Rust forbids loops','Compilers disagree'],1,'Determinism is a control-theory requirement.'),
  TIP('Pattern to steal: each stage owns its thread/task and talks via bounded channels. Backpressure is explicit. Nothing shares mutable state.')
 ]},
 {id:'r9l2',t:'Wired: I²C, SPI, Serial',icon:'🔌',min:13,b:[
  P('Sensors speak buses. On Linux SBCs: `linux-embedded-hal`. On microcontrollers: HAL crates (`stm32`, `rp2040-hal`). All implement the same `embedded-hal` traits — portable drivers.'),
  C('use embedded_hal::i2c::I2c;\n\nconst IMU_ADDR: u8 = 0x68;\n\nfn read_accel_x(i2c: &mut impl I2c) -> Result<i16, impl core::fmt::Debug> {\n    let mut buf = [0u8; 2];\n    i2c.write_read(IMU_ADDR, &[0x3B], &mut buf)?;   // reg 0x3B\n    Ok(i16::from_be_bytes(buf))\n}'),
  F('The register-address-then-read pattern in one call:',
    'i2c.___(ADDR, &[REG], &mut buf)?;',[['write_read']],'write_read(slave, write_buf, read_buf).'),
  Q('Raw counts from an ADC mean nothing until…',
    ['Printed','Converted with scale factors + bias (calibration)','Rounded','Squared'],1,'x = raw * scale + bias — the first fusion step.')
 ]},
 {id:'r9l3',t:'IMU Physics 101',icon:'🧭',min:14,b:[
  P('An IMU gives an **accelerometer** (specific force, m/s² + gravity) and a **gyroscope** (angular rate, rad/s). Gyros drift; accelerometers get noisy. This asymmetry is exactly why fusion exists.'),
  UL(['Gyro integrated once → angle (drifts without bound)','Accelerometer → tilt from gravity (only valid when not accelerating)','Magnetometer → heading (distorted near motors)']),
  Q('Integrating a gyro with a 0.01 rad/s bias for 60 s yields an angle error of…',
    ['0.01°','~0.6 rad ≈ 34°','Zero — bias cancels','60 rad'],1,'Bias × time = accumulated error. Unbounded.'),
  Q('Accelerometers can\u2019t give trustworthy tilt when…',
    ['The robot is stationary','The robot accelerates linearly','It is calibrated','Sampling > 100 Hz'],1,'a_meas = a_motion + g — the filter must split them.')
 ]},
 {id:'r9l4',t:'The Real-Time Loop',icon:'⏱️',min:12,b:[
  P('Every fusion loop needs an honest **dt**. Timestamp with a monotonic clock, never assume constant rate, clamp dt against hangs.'),
  C('use std::time::Instant;\n\nlet mut last = Instant::now();\nloop {\n    let now = Instant::now();\n    let dt = now.duration_since(last).as_secs_f64().min(0.05);\n    last = now;\n\n    let sample = read_imu();\n    state = predict(state, dt);\n    state = update(state, sample);\n\n    spin_until(now + std::time::Duration::from_millis(5));\n}'),
  F('Clamp dt so a 2-second hiccup can\u2019t explode the filter:',
    'let dt = elapsed.as_secs_f64().___(0.05);',[['min']],'Clamping keeps predict() sane after scheduling surprises.')
 ]}
]},
{n:'SENSOR FUSION LAB',tag:'The heart of the endgame: state estimation from noisy reality.',icon:'🧿',lessons:[
 {id:'r10l1',t:'Why Fuse?',icon:'🎭',min:12,b:[
  P('Each sensor is a liar with a specialty. Fusion = combining measurements under a **model** to estimate hidden state better than any sensor alone: predict with physics, correct with measurements.'),
  UL(['Predict: propagate state with a motion model (uncertainty GROWS)','Update: fold in a measurement (uncertainty SHRINKS)','Repeat forever at loop rate']),
  Q('Fusing N independent noisy sensors typically reduces variance by…',
    ['Nothing','~1/N — the average is tighter than any member','Increasing N','Only if identical'],1,'Independent errors partially cancel.'),
  Q('The Kalman filter is optimal when…',
    ['Always','System is linear with Gaussian noise','Only in simulation','Only with GPS'],1,'Nonlinear world → EKF/UKF approximate the same idea.')
 ]},
 {id:'r10l2',t:'Kalman Filter, From Scratch',icon:'🥋',min:25,boss:true,b:[
  BOSS('BOSS QUEST. Hand-implement a working 1-D Kalman filter — with automated tests running in your browser. This exact math flies in real rockets and drones.'),
  P('State: estimate `x`, uncertainty `p`. Two equations each loop:'),
  UL(['**Predict**: p = p + q — q is process noise: how much the world surprises us.','**Update**: gain k = p / (p + r); x = x + k·(z − x); p = (1 − k)·p — r is measurement noise.']),
  P('Read that again: **the gain balances the two uncertainties**. That is sensor fusion in one line.'),
  C('struct Kf { x: f64, p: f64, q: f64, r: f64 }\n\nfn predict(k: Kf) -> Kf {\n    Kf { p: k.p + k.q, ..k }      // ..k copies the rest\n}\n\nfn update(k: Kf, z: f64) -> Kf {\n    let gain = k.p / (k.p + k.r);\n    Kf { x: k.x + gain * (z - k.x), p: (1.0 - gain) * k.p, ..k }\n}'),
  T('Implement predict/update below (the struct is given). Two tests will run <code>cargo-test</code> style, then the main loop must converge: print <code>final: {:.3}</code> within ±0.06 of 1.0.',
    'struct Kf { x: f64, p: f64, q: f64, r: f64 }\n\n// fn predict(k: Kf) -> Kf { ... }\n// fn update(k: Kf, z: f64) -> Kf { ... }\n\n#[test]\nfn test_update_moves_toward_measurement() {\n    let k = Kf { x: 0.0, p: 1.0, q: 0.002, r: 0.05 };\n    let u = update(k, 10.0);\n    assert!(u.x > 0.0);\n}\n\n#[test]\nfn test_predict_grows_uncertainty() {\n    let k = Kf { x: 1.0, p: 0.5, q: 0.01, r: 0.05 };\n    assert!(predict(k).p > 0.5);\n}\n\nfn main() {\n    let mut k = Kf { x: 0.0, p: 1.0, q: 0.002, r: 0.05 };\n    let zs = [0.9, 1.05, 0.98, 1.02, 1.0];\n    for z in zs {\n        k = predict(k);\n        k = update(k, z);\n        println!("est: {:.3}", k.x);\n    }\n    println!("final: {:.3}", k.x);\n}\n','kalman','predict: Kf { p: k.p + k.q, ..k }. update: gain = k.p / (k.p + k.r); then x + gain*(z - x). Watch est: climb 0 → ~1.'),
  TIP('Run it with r=1.0 vs r=0.001 and watch the gain change. You are now tuning filters — this is literally the job.')
 ]},
 {id:'r10l3',t:'Orientation: Quaternions & Complementary Filters',icon:'🌀',min:16,b:[
  P('For attitude, angles suffer gimbal lock; **unit quaternions** don\u2019t. Complementary filter = gorgeous entry-level fusion: gyro gives fast-but-drifting angle; accel gives slow-but-honest angle; blend them.'),
  C('const ALPHA: f64 = 0.98;\n\nfn step(angle: f64, gyro: f64, accel_angle: f64, dt: f64) -> f64 {\n    ALPHA * (angle + gyro * dt) + (1.0 - ALPHA) * accel_angle\n}\n// 98% trust gyro short-term, 2% pulls drift back to gravity truth'),
  F('The complementary blend coefficient multiplies the gyro path:',
    'let next = ___ * (angle + gyro * dt) + (1.0 - ALPHA) * accel_angle;',[['ALPHA','0.98']],'High alpha = agile but drift-prone; low = sluggish but honest.'),
  Q('Quaternions beat Euler angles because…',
    ['They are smaller','No gimbal lock + cheap, stable composition of rotations','They are easier to print','GPS requires them'],1,'4 numbers, normalized, interpolate smoothly.'),
  Q('A quaternion is unit-normalized every loop to avoid…',
    ['Overflow','Scaling creep turning rotation into scaling','Underflow','Deadlocks'],1,'Numerical hygiene in flight code.')
 ]},
 {id:'r10l4',t:'EKF with nalgebra',icon:'🧠',min:20,b:[
  P('Real robots are nonlinear. The **Extended Kalman Filter** linearizes motion/measurement models via Jacobians and runs the same predict/update math on matrices. `nalgebra` is the workhorse: stack-allocated `SVector`/`SMatrix`.'),
  C('// nalgebra = "0.33"\nuse nalgebra::{SMatrix, SVector};\n\ntype S6 = SVector<f64, 6>;          // [x y z vx vy vz]\ntype M6 = SMatrix<f64, 6, 6>;\n\nfn predict(x: S6, p: M6, f: &M6, q: &M6) -> (S6, M6) {\n    (f * x, f * p * f.transpose() + q)\n}\n\nfn update(x: S6, p: M6, z: SVector<f64,3>, h: &SMatrix<f64,3,6>, r: &SMatrix<f64,3,3>) -> (S6, M6) {\n    let s = h * p * h.transpose() + r;                    // innovation cov\n    let k = p * h.transpose() * s.try_inverse().unwrap(); // Kalman gain\n    (x + k * (z - h * x), (M6::identity() - k * h) * p)\n}'),
  Q('In the EKF, the Jacobian F is…',
    ['The sensor driver','The linearized state-transition: how small state changes propagate','The motor matrix','A random seed'],1,'EKF = “Kalman on the local tangent plane”, recomputed every step.'),
  Q('When would you pick UKF over EKF?',
    ['Never','Strongly nonlinear models where Jacobians are painful or biased','Only in 1-D','When there is no noise'],1,'UKF propagates sigma points — no derivatives.'),
  Q('IMU + GPS fusion: the IMU mostly drives…, GPS mostly drives…',
    ['Update; predict','Predict (fast rate); correcting drift via update','Both predict','Neither'],1,'IMU between fixes; GPS fixes pull drift back.')
 ]}
]},
{n:'MACHINE INTELLIGENCE',tag:'Neural networks and learning — in Rust.',icon:'🧠',lessons:[
 {id:'r11l1',t:'The Rust AI Stack',icon:'🗼',min:12,b:[
  P('Rust is becoming the systems layer of ML: **candle** (Hugging Face tensors), **burn** (training + inference), **ort** (ONNX Runtime — deploy PyTorch models), **linfa** (classical ML). Train in Python if you like — *deploy* in Rust: no GC, static binaries, GPU via CUDA/Metal/WGPU.'),
  Q('Fastest way to run an existing Python-trained model on a robot?',
    ['Rewrite the model in Rust by hand','Export ONNX → run with ort','Run Python as a subprocess forever','Impossible'],1,'ONNX is the lingua franca of deployment.'),
  Q('Why Rust for the inference layer?',
    ['Better math libraries than Python','Deterministic latency, tiny footprint, easy static deployment','It trains faster','GPUs only work with Rust'],1,'Operations + latency, not replacing research workflows.')
 ]},
 {id:'r11l2',t:'Perception Inference in Practice',icon:'👁️',min:14,b:[
  P('The loop: preprocess on CPU (`image` crate), run the session, post-process (NMS, decode boxes). Keep the session warm; reuse buffers; quantize (int8) for MCUs.'),
  C('// ort = "2"\nuse ort::session::Session;\n\nlet session = Session::builder()?.commit_from_file("detector.onnx")?;\n// outputs = session.run(inputs![img_tensor]?)?;\n// post-process -> Vec<Detection { class, score, bbox }>'),
  F('The struct that owns the loaded model:',
    'let session = ___::builder()?.commit_from_file("detector.onnx")?;',[['Session','ort::Session']],'One Session per model, built once, reused every frame.'),
  Q('Quantization (f32 → i8) mainly buys…',
    ['Accuracy','~4× smaller model and much faster CPU/MCU inference','More outputs','Python compatibility'],1,'Small accuracy tax, huge throughput win.')
 ]},
 {id:'r11l3',t:'Learning to Control: RL in Rust',icon:'🎮',min:13,b:[
  P('Policy = state → action. Rust runs blazing simulators collecting millions of steps per minute; ship policies as ONNX. PPO and SAC translate cleanly to tensor code.'),
  Q('The piece that runs ON the robot is usually…',
    ['The full trainer','A frozen policy network doing forward passes only','The simulator','Python'],1,'Training is offline/heavy; deployment is a tight inference loop.'),
  Q('Reward hacking matters in robotics because…',
    ['Rewards are slow','The optimizer exploits ANY gap between reward and intent','Rust forbids it','GPUs distort rewards'],1,'Sim-to-real + careful reward design are core research problems.')
 ]},
 {id:'r11l4',t:'The Full Pipeline',icon:'🔗',min:14,b:[
  O('Assemble the complete AI-robot perception→action pipeline in order:',
    ['1. Sensors emit raw frames/scan/IMU','2. Preprocess (sync, calibrate, tensorize)','3. Neural inference (detections / features)','4. Fuse detections + filters into world state','5. Planner / policy chooses action','6. Actuator command + telemetry log']),
  Q('Where does the Kalman filter sit relative to the neural net?',
    ['It replaces it','Fusion integrates NN outputs over TIME; nets perceive a single frame','Before the sensors','Only in simulation'],1,'NNs see instants; filters build a coherent moving world. Teammates.'),
  TIP('This exact topology — drivers → fusion → policy — is your capstone blueprint. You have now seen every layer.')
 ]}
]},
{n:'CAPSTONE: AUTONOMY',tag:'Design it. Ship it. Become dangerous.',icon:'👑',lessons:[
 {id:'r12l1',t:'Capstone Blueprint',icon:'📐',min:18,boss:true,b:[
  BOSS('FINAL CAMPAIGN. Design an autonomous ground robot stack in pure Rust. No new syntax — architecture judgment.'),
  P('Spec: a rover with differential drive, IMU (200 Hz), wheel encoders, GPS (5 Hz), and a camera. It must localize, avoid obstacles, and log everything.'),
  C('rover/\n├─ drivers/     # imu, encoders, gps, camera  (embedded-hal traits)\n├─ fusion/      # EKF over IMU+encoders, GPS corrections\n├─ perception/  # ort session, obstacle cells\n├─ control/     # pure-pursuit + PID, 500 Hz\n├─ safety/      # watchdog, e-stop, geofence\n└─ bin/         # roverd daemon + telemetry CLI'),
  O('Order the build plan so risk dies early:',
    ['1. Blink: read IMU raw values, print them','2. Fuse: 1-D Kalman on one axis, validate vs ground truth','3. Drive: closed-loop PID on wheel encoders','4. Localize: full EKF (pose from IMU+encoders+GPS)','5. Perceive: obstacle detector via ort','6. Autonomy: planner + safety monitor + logging']),
  Q('Why build the safety/watchdog layer EARLY?',
    ['It is easy','Every later test session runs on hardware that can hurt itself — safety gates all experiments','Marketing','It blocks compilation'],1,'The e-stop exists before the behavior does.'),
  Q('Where do the channels live in this design?',
    ['Nowhere — shared globals','Between stages: drivers→fusion→control, bounded + timestamped','Inside the EKF only','In Python'],1,'Typed messages with time headers between owned stages.')
 ]},
 {id:'r12l2',t:'Ship It: Tests, CI, Docs, Crates',icon:'🚢',min:13,b:[
  P('Professional Rust = `cargo test` everywhere, property tests with `proptest`, hardware-in-the-loop harnesses, `clippy` as a team member, CI matrix builds. Fusion code demands **golden datasets**: replay recorded sensor logs, assert estimate error bounds.'),
  C('#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn kalman_tracks_constant() {\n        let mut k = Kf { x: 0.0, p: 1.0, q: 0.002, r: 0.05 };\n        for _ in 0..50 { k = predict(k); k = update(k, 1.0); }\n        assert!((k.x - 1.0).abs() < 0.05);\n    }\n}'),
  F('The attribute that marks a test function:',
    '#[___]\nfn kalman_tracks_constant() { }',[['test']],'cargo test runs everything marked #[test]. You used this in Rank 10!'),
  Q('Replay testing recorded sensor logs exists because…',
    ['Logs are free storage','Field bugs are hard to reproduce — deterministic replay makes fusion regressions testable','CI requires it','GPS mandates it'],1,'Exactly how real autonomy teams gate releases.')
 ]},
 {id:'r12l3',t:'The Final Boss',icon:'🐉',min:20,boss:true,b:[
  BOSS('Three trials. Pass them and the forge is yours.'),
  Q('TRIAL I — Ownership: `fn process(v: Vec<f64>)` consumes the vector. To keep using it after, you should…',
    ['Use unsafe','Pass &Vec<f64> (or &[f64]) instead, or clone deliberately','Call gc()','Restart the program'],1,'Borrow by default; own at the boundaries.'),
  Q('TRIAL II — Concurrency: the minimal shared counter across threads is…',
    ['Rc<RefCell<i32>>','Arc<Mutex<i32>>','Box<i32>','&mut i32'],1,'Arc carries it across threads; Mutex guards the write.'),
  Q('TRIAL III — Fusion: doubling measurement noise r makes the filter…',
    ['Trust measurements more','Trust measurements less — smaller gain, slower but smoother convergence','Crash','Ignore the model'],1,'You built this in Rank 10. Gain k = p/(p+r).'),
  P('**Where next?** Contribute to `rclrs` (ROS 2 in Rust), read flight-controller source, publish a crate, rebuild the capstone on real hardware. The compiler was strict with you because the real world is stricter. Go build something that moves.'),
  TIP('🦀 You finished RUSTFORGE. From <code>cargo new</code> to sensor-fusion robotics — the rest is reps. Keep the streak alive: mastery compounds.')
 ]}
]}
]};
