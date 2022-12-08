use std::fs;
use std::collections::HashMap;
use std::rc::Rc;

fn main() {
    let input = fs::read_to_string("test_input.txt").expect("error reading input file");
    part1(&input);
    // part2(&input);
}

fn part1(input: &str) {
    
    let root = Node {
        parent: None,
        size: 0,
        children: Some(HashMap::new()),
    };

    let mut node = root;
    let lines: Vec<&str> = input.lines().collect();
    for mut i in 0..lines.len() {
        let line = lines[i];
        let split: Vec<&str> = line.split(' ').collect();
        match split[1] {
            "cd" => {
                match split[2] {
                    "/" => {
                        node = root;
                    },
                    ".." => {
                        node = node.parent.unwrap().get_mut();
                    },
                    dir => {
                        node = node.children.unwrap()[dir];
                    }
                }
            },
            "ls" => {
                loop {
                    line = lines[i];
                    let split: Vec<&str> = line.split(' ').collect();
                    match split[0] {
                        "$" => {
                            break;
                        },
                        "dir" => {
                            node.children.unwrap()[split[1]] = Node {
                                parent: Some(Rc::new(node)),
                                size: 0,
                                children: Some(HashMap::new()),
                            }
                        },
                        _ => {
                            node.children.unwrap()[split[1]] = Node {
                                parent: Some(Rc::new(node)),
                                size: split[0].parse::<u32>().unwrap(),
                                children: None
                            }
                        }
                    };
                };
            },
            _ => panic!("oops")
        };
    }

}

// fn part2(input: &str) {
//     println!("part 2: {}", solve(input, 14));
// }

struct Node {
    parent: Option<Rc<Node>>,
    size: u32,
    children: Option<HashMap<&str, Node>>
}