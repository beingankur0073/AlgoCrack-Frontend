export const exampleQuestion = {
  id: "string-to-integer-atoi",
  title: "String to Integer (atoi)",
  difficulty: "Medium",
  description: "Implement the myAtoi(string s) function...",
  examples: [
    { input: { s: "\"42\"" }, output: "42" }
  ],
  testCases: [
    { input: { s: "42" }, expectedOutput: 42, isSample: true }
  ],
  constraints: [
    "-2³¹ <= result <= 2³¹ - 1",
    "The string s consists of English letters..."
  ],
  functionSignatures: {
    cpp: {
      signature: "int myAtoi(std::string s)",
      parameters: [{ name: "s", type: "std::string" }],
      returnType: "int"
    }
  },
  boilerplateCode: {
    cpp: `class Solution {
public:
    int myAtoi(std::string s) {
        // Write your code here
    }
};`
  },
  timeLimit: 1000,
  memoryLimit: 128
};


