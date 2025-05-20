const sampleProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
    ],
    functionSignature: "function twoSum(nums, target) { }",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "([)]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10⁴",
      "s consists of parentheses only",
    ],
    functionSignature: "function isValid(s) { }",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10⁴",
      "s consists of English letters, digits, symbols and spaces",
    ],
    functionSignature: "function lengthOfLongestSubstring(s) { }",
  },
  {
    id: 4,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description:
      "You are given the heads of two sorted linked lists. Merge the two lists in a sorted manner and return the merged list.",
    examples: [
      { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
    ],
    functionSignature: "function mergeTwoLists(l1, l2) { }",
  },
  {
    id: 5,
    title: "Reverse Integer",
    difficulty: "Easy",
    description:
      "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside signed 32-bit integer range, return 0.",
    examples: [
      { input: "x = 123", output: "321" },
      { input: "x = -123", output: "-321" },
    ],
    constraints: ["-2³¹ <= x <= 2³¹ - 1"],
    functionSignature: "function reverse(x) { }",
  },
  {
    id: 6,
    title: "Container With Most Water",
    difficulty: "Medium",
    description:
      "Given `n` non-negative integers a₁, a₂, ..., aₙ, where each represents a point at coordinate (i, aᵢ). Find two lines that, together with the x-axis, form a container that holds the most water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10⁵",
      "0 <= height[i] <= 10⁴",
    ],
    functionSignature: "function maxArea(height) { }",
  },
  {
    id: 7,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description:
      "Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
    ],
    functionSignature: "function findMedianSortedArrays(nums1, nums2) { }",
  },
  {
    id: 8,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description:
      "You are given a rotated sorted array and a target value. Return the index if the target is found. If not, return -1.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10⁴ <= nums[i] <= 10⁴",
    ],
    functionSignature: "function search(nums, target) { }",
  },
  {
    id: 9,
    title: "Climbing Stairs",
    difficulty: "Easy",
    description:
      "You are climbing a staircase. Each time you can either take 1 or 2 steps. Given `n`, how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" },
    ],
    constraints: ["1 <= n <= 45"],
    functionSignature: "function climbStairs(n) { }",
  },
  {
    id: 10,
    title: "Word Break",
    difficulty: "Medium",
    description:
      "Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true" },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
    ],
    functionSignature: "function wordBreak(s, wordDict) { }",
  },
  {
    id: 11,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description:
      "Given an array `prices` where prices[i] is the price of a stock on the ith day, find the maximum profit you can achieve. You may complete only one transaction.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
    ],
    constraints: [
      "1 <= prices.length <= 10⁵",
      "0 <= prices[i] <= 10⁴",
    ],
    functionSignature: "function maxProfit(prices) { }",
  },
  {
    id: 12,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description:
      "Given an integer array `nums`, return an array `answer` such that answer[i] is equal to the product of all elements of `nums` except `nums[i]`.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
    ],
    constraints: [
      "2 <= nums.length <= 10⁵",
      "All elements are non-zero",
    ],
    functionSignature: "function productExceptSelf(nums) { }",
  },
  {
    id: 13,
    title: "Subsets",
    difficulty: "Medium",
    description:
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
    examples: [
      { input: "nums = [1,2,3]", output: "[[3],[1],[2],[1,2,3],[1,3],[2,3],[1,2],[]]" },
    ],
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
    ],
    functionSignature: "function subsets(nums) { }",
  },
  {
    id: 14,
    title: "Permutations",
    difficulty: "Medium",
    description:
      "Given an array `nums` of distinct integers, return all possible permutations.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
    ],
    constraints: [
      "1 <= nums.length <= 6",
    ],
    functionSignature: "function permute(nums) { }",
  },
  {
    id: 15,
    title: "Valid Palindrome",
    difficulty: "Easy",
    description:
      "Given a string `s`, return true if it is a palindrome, or false otherwise. Consider only alphanumeric characters and ignore cases.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
    ],
    constraints: [
      "1 <= s.length <= 2 * 10⁵",
    ],
    functionSignature: "function isPalindrome(s) { }",
  },
  {
    id: 16,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return its maximum depth.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    ],
    constraints: [
      "The number of nodes is in the range [0, 10⁴]",
    ],
    functionSignature: "function maxDepth(root) { }",
  },
  {
    id: 17,
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes.",
    examples: [
      { input: "root = [1,2,3,4,5]", output: "3" },
    ],
    constraints: [
      "The number of nodes is in the range [1, 10⁴]",
    ],
    functionSignature: "function diameterOfBinaryTree(root) { }",
  },
  {
    id: 18,
    title: "Number of Islands",
    difficulty: "Medium",
    description:
      "Given a 2D grid map of '1's (land) and '0's (water), return the number of islands.",
    examples: [
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
    ],
    functionSignature: "function numIslands(grid) { }",
  },
  {
    id: 19,
    title: "Minimum Path Sum",
    difficulty: "Medium",
    description:
      "Given a m x n grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along its path.",
    examples: [
      {
        input: `grid = [
  [1,3,1],
  [1,5,1],
  [4,2,1]
]`,
        output: "7",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 200",
    ],
    functionSignature: "function minPathSum(grid) { }",
  },
  {
    id: 20,
    title: "Coin Change",
    difficulty: "Medium",
    description:
      "Given an integer array `coins` and an integer `amount`, return the fewest number of coins needed to make up that amount. If not possible, return -1.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10⁴",
    ],
    functionSignature: "function coinChange(coins, amount) { }",
  },
];


export default sampleProblems
