# Design Patterns in C++

C++ examples of some classic GoF design patterns.

- [x] **Conceptual** examples show the internal structure of patterns with detailed comments.

- [ ] **RealWold** examples show how the patterns can be used in a real-world C++ application.

## Requirements

The examples were written as cross platform console application using c++11. It means that you should be able to compile and execute those examples with any recent compiler.

For code execution in VSCode you will need to set up your task first. An example using g++ :

```sh
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "g++ -g -std=c++11 Conceptual/main.cc -o main",
            "group":{
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher":"$gcc"
        }
    ]
}
```
