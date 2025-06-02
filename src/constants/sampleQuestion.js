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
    functionSignature: {
      javascript: "function twoSum(nums, target) { }",
      python: "def twoSum(nums, target):",
      java: "public int[] twoSum(int[] nums, int target) { }",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) { }",
    },
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
    functionSignature: {
      javascript: "function isValid(s) { }",
      python: "def isValid(s):",
      java: "public boolean isValid(String s) { }",
      cpp: "bool isValid(string s) { }",
    },
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
    functionSignature: {
      javascript: "function lengthOfLongestSubstring(s) { }",
      python: "def lengthOfLongestSubstring(s):",
      java: "public int lengthOfLongestSubstring(String s) { }",
      cpp: "int lengthOfLongestSubstring(string s) { }",
    },
  },
  {
    id: 4,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description:
      "You are given the heads of two sorted linked lists list1 and list2.Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.Return the head of the merged linked list.",
    examples: [
      { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "l1 = [], l2 = []", output: "[]" },
      { input: "l1 = [], l2 = [0]", output: "[0]" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
    ],
    functionSignature: {
      javascript: "function mergeTwoLists(l1, l2) { }",
      python: "def mergeTwoLists(l1, l2):",
      java: "public ListNode mergeTwoLists(ListNode l1, ListNode l2) { }",
      cpp: "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) { }",
    },
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
    functionSignature: {
      javascript: "function reverse(x) { }",
      python: "def reverse(x):",
      java: "public int reverse(int x) { }",
      cpp: "int reverse(int x) { }",
    },
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
    functionSignature: {
      javascript: "function maxArea(height) { }",
      python: "def maxArea(height):",
      java: "public int maxArea(int[] height) { }",
      cpp: "int maxArea(vector<int>& height) { }",
    },
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
    functionSignature: {
      javascript: "function findMedianSortedArrays(nums1, nums2) { }",
      python: "def findMedianSortedArrays(nums1, nums2):",
      java: "public double findMedianSortedArrays(int[] nums1, int[] nums2) { }",
      cpp: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) { }",
    },
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
    functionSignature: {
      javascript: "function search(nums, target) { }",
      python: "def search(nums, target):",
      java: "public int search(int[] nums, int target) { }",
      cpp: "int search(vector<int>& nums, int target) { }",
    },
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
    functionSignature: {
      javascript: "function climbStairs(n) { }",
      python: "def climbStairs(n):",
      java: "public int climbStairs(int n) { }",
      cpp: "int climbStairs(int n) { }",
    },
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
    functionSignature: {
      javascript: "function wordBreak(s, wordDict) { }",
      python: "def wordBreak(s, wordDict):",
      java: "public boolean wordBreak(String s, List<String> wordDict) { }",
      cpp: "bool wordBreak(string s, vector<string>& wordDict) { }",
    },
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
    functionSignature: {
      javascript: "function maxProfit(prices) { }",
      python: "def maxProfit(prices):",
      java: "public int maxProfit(int[] prices) { }",
      cpp: "int maxProfit(vector<int>& prices) { }",
    },
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
    functionSignature: {
      javascript: "function productExceptSelf(nums) { }",
      python: "def productExceptSelf(nums):",
      java: "public int[] productExceptSelf(int[] nums) { }",
      cpp: "vector<int> productExceptSelf(vector<int>& nums) { }",
    },
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
    functionSignature: {
      javascript: "function subsets(nums) { }",
      python: "def subsets(nums):",
      java: "public List<List<Integer>> subsets(int[] nums) { }",
      cpp: "vector<vector<int>> subsets(vector<int>& nums) { }",
    },
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
    functionSignature: {
      javascript: "function permute(nums) { }",
      python: "def permute(nums):",
      java: "public List<List<Integer>> permute(int[] nums) { }",
      cpp: "vector<vector<int>> permute(vector<int>& nums) { }",
    },
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
    functionSignature: {
      javascript: "function isPalindrome(s) { }",
      python: "def isPalindrome(s):",
      java: "public boolean isPalindrome(String s) { }",
      cpp: "bool isPalindrome(string s) { }",
    },
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
    functionSignature: {
      javascript: "function maxDepth(root) { }",
      python: "def maxDepth(root):",
      java: "public int maxDepth(TreeNode root) { }",
      cpp: "int maxDepth(TreeNode* root) { }",
    },
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
    functionSignature: {
      javascript: "function diameterOfBinaryTree(root) { }",
      python: "def diameterOfBinaryTree(root):",
      java: "public int diameterOfBinaryTree(TreeNode root) { }",
      cpp: "int diameterOfBinaryTree(TreeNode* root) { }",
    },
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
    functionSignature: {
      javascript: "function numIslands(grid) { }",
      python: "def numIslands(grid):",
      java: "public int numIslands(char[][] grid) { }",
      cpp: "int numIslands(vector<vector<char>>& grid) { }",
    },
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
    functionSignature: {
      javascript: "function minPathSum(grid) { }",
      python: "def minPathSum(grid):",
      java: "public int minPathSum(int[][] grid) { }",
      cpp: "int minPathSum(vector<vector<int>>& grid) { }",
    },
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
    functionSignature: {
      javascript: "function coinChange(coins, amount) { }",
      python: "def coinChange(coins, amount):",
      java: "public int coinChange(int[] coins, int amount) { }",
      cpp: "int coinChange(vector<int>& coins, int amount) { }",
    },
  },
  {
    id: 21,
    title: "Find Peak Element",
    difficulty: "Medium",
    description:
      "A peak element is an element that is strictly greater than its neighbors. Given an input array `nums`, return the index of any one of its peak elements.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2" },
    ],
    constraints: [
      "1 <= nums.length <= 1000",
      "-2³¹ <= nums[i] <= 2³¹ - 1",
    ],
    functionSignature: {
      javascript: "function findPeakElement(nums) { }",
      python: "def findPeakElement(nums):",
      java: "public int findPeakElement(int[] nums) { }",
      cpp: "int findPeakElement(vector<int>& nums) { }",
    },
  },
  {
    id: 22,
    title: "Course Schedule",
    difficulty: "Medium",
    description:
      "There are a total of `numCourses` courses you have to take, labeled from 0 to numCourses-1. Some courses may have prerequisites. Determine if it is possible to finish all courses.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
    ],
    functionSignature: {
      javascript: "function canFinish(numCourses, prerequisites) { }",
      python: "def canFinish(numCourses, prerequisites):",
      java: "public boolean canFinish(int numCourses, int[][] prerequisites) { }",
      cpp: "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) { }",
    },
  },
  {
    id: 23,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    description:
      "Given a non-empty array of integers, return the k most frequent elements.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
    ],
    constraints: [
      "1 <= nums.length <= 10⁵",
      "k is in the range [1, the number of unique elements]",
    ],
    functionSignature: {
      javascript: "function topKFrequent(nums, k) { }",
      python: "def topKFrequent(nums, k):",
      java: "public int[] topKFrequent(int[] nums, int k) { }",
      cpp: "vector<int> topKFrequent(vector<int>& nums, int k) { }",
    },
  },
  {
    id: 24,
    title: "LRU Cache",
    difficulty: "Medium",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    examples: [
      { input: "LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)", output: "1, -1" },
    ],
    constraints: [
      "1 <= capacity <= 3000",
    ],
    functionSignature: {
      javascript: "class LRUCache { constructor(capacity) { } get(key) { } put(key, value) { } }",
      python: "class LRUCache:\n    def __init__(self, capacity: int):\n    def get(self, key: int) -> int:\n    def put(self, key: int, value: int) -> None:",
      java: "class LRUCache { public LRUCache(int capacity) { } public int get(int key) { } public void put(int key, int value) { } }",
      cpp: "class LRUCache { public: LRUCache(int capacity) { } int get(int key) { } void put(int key, int value) { } };",
    },
  },
  {
    id: 25,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    description:
      "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
    ],
    functionSignature: {
      javascript: "function findMin(nums) { }",
      python: "def findMin(nums):",
      java: "public int findMin(int[] nums) { }",
      cpp: "int findMin(vector<int>& nums) { }",
    },
  },
  {
    id: 26,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    description:
      "Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    ],
    constraints: [
      "1 <= k <= nums.length <= 10⁴",
    ],
    functionSignature: {
      javascript: "function findKthLargest(nums, k) { }",
      python: "def findKthLargest(nums, k):",
      java: "public int findKthLargest(int[] nums, int k) { }",
      cpp: "int findKthLargest(vector<int>& nums, int k) { }",
    },
  },
  {
    id: 27,
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    description:
      "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    examples: [
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", output: "3" },
    ],
    constraints: [
      "The number of nodes in the binary tree is in the range [2, 10⁵]",
    ],
    functionSignature: {
      javascript: "function lowestCommonAncestor(root, p, q) { }",
      python: "def lowestCommonAncestor(root, p, q):",
      java: "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) { }",
      cpp: "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) { }",
    },
  },
  {
    id: 28,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    examples: [
      { input: 's = "babad"', output: '"bab"' },
    ],
    constraints: [
      "1 <= s.length <= 1000",
    ],
    functionSignature: {
      javascript: "function longestPalindrome(s) { }",
      python: "def longestPalindrome(s):",
      java: "public String longestPalindrome(String s) { }",
      cpp: "string longestPalindrome(string s) { }",
    },
  },
  {
    id: 29,
    title: "Rotate Image",
    difficulty: "Medium",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    examples: [
      {
        input: `matrix = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]`,
        output: `[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]`,
      },
    ],
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
    ],
    functionSignature: {
      javascript: "function rotate(matrix) { }",
      python: "def rotate(matrix):",
      java: "public void rotate(int[][] matrix) { }",
      cpp: "void rotate(vector<vector<int>>& matrix) { }",
    },
  },
  {
    id: 30,
    title: "Merge Intervals",
    difficulty: "Medium",
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
    ],
    constraints: [
      "1 <= intervals.length <= 10⁴",
    ],
    functionSignature: {
      javascript: "function merge(intervals) { }",
      python: "def merge(intervals):",
      java: "public int[][] merge(int[][] intervals) { }",
      cpp: "vector<vector<int>> merge(vector<vector<int>>& intervals) { }",
    },
  },
  // Adding 5 more problems
  {
    id: 31,
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: [
      "1 <= strs.length <= 10⁴",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    functionSignature: {
      javascript: "function groupAnagrams(strs) { }",
      python: "def groupAnagrams(strs):",
      java: "public List<List<String>> groupAnagrams(String[] strs) { }",
      cpp: "vector<vector<string>> groupAnagrams(vector<string>& strs) { }",
    },
  },
  {
    id: 32,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    description: "Given an array of meeting time intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of conference rooms required.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
      { input: "intervals = [[7,10],[2,4]]", output: "1" },
    ],
    constraints: [
      "1 <= intervals.length <= 10⁴",
      "0 <= starti < endi <= 10⁶",
    ],
    functionSignature: {
      javascript: "function minMeetingRooms(intervals) { }",
      python: "def minMeetingRooms(intervals):",
      java: "public int minMeetingRooms(int[][] intervals) { }",
      cpp: "int minMeetingRooms(vector<vector<int>>& intervals) { }",
    },
  },
  {
    id: 33,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    examples: [
      { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" },
      { input: "root = []", output: "[]" },
      { input: "root = [1]", output: "[1]" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10⁴].",
      "-1000 <= Node.val <= 1000",
    ],
    functionSignature: {
      javascript: "class Codec { serialize(root) { } deserialize(data) { } }",
      python: "class Codec:\n    def serialize(self, root):\n    def deserialize(self, data):",
      java: "public class Codec { public String serialize(TreeNode root) { } public TreeNode deserialize(String data) { } }",
      cpp: "class Codec { public: string serialize(TreeNode* root) { } TreeNode* deserialize(string data) { } };",
    },
  },
  {
    id: 34,
    title: "Word Search",
    difficulty: "Medium",
    description: "Given an `m x n` grid of characters and a `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    examples: [
      {
        input: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"`,
        output: "true",
      },
      {
        input: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"`,
        output: "true",
      },
      {
        input: `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"`,
        output: "false",
      },
    ],
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consists of only lowercase and uppercase English letters.",
    ],
    functionSignature: {
      javascript: "function exist(board, word) { }",
      python: "def exist(board, word):",
      java: "public boolean exist(char[][] board, String word) { }",
      cpp: "bool exist(vector<vector<char>>& board, string word) { }",
    },
  },
  {
    id: 35,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4" },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
      { input: "nums = [7,7,7,7,7,7,7]", output: "1" },
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10⁴ <= nums[i] <= 10⁴",
    ],
    functionSignature: {
      javascript: "function lengthOfLIS(nums) { }",
      python: "def lengthOfLIS(nums):",
      java: "public int lengthOfLIS(int[] nums) { }",
      cpp: "int lengthOfLIS(vector<int>& nums) { }",
    },
  },
  // Additional 5 problems
  {
    id: 36,
    title: "House Robber",
    difficulty: "Medium",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, an integer array `nums` representing the amount of money in each house. If two adjacent houses are robbed, it will trigger an alarm. Determine the maximum amount of money you can rob tonight without alerting the police.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4" },
      { input: "nums = [2,7,9,3,1]", output: "12" },
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400",
    ],
    functionSignature: {
      javascript: "function rob(nums) { }",
      python: "def rob(nums):",
      java: "public int rob(int[] nums) { }",
      cpp: "int rob(vector<int>& nums) { }",
    },
  },
  {
    id: 37,
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "Medium",
    description: "Given `n` nodes labeled from `0` to `n - 1` and a list of undirected edges (each edge is a pair of nodes), write a function to find the number of connected components in the graph.",
    examples: [
      { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" },
      { input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", output: "1" },
    ],
    constraints: [
      "1 <= n <= 2000",
      "1 <= edges.length <= 5000",
      "edges[i].length == 2",
      "0 <= ai < bi < n",
      "ai != bi",
      "There are no duplicate edges.",
    ],
    functionSignature: {
      javascript: "function countComponents(n, edges) { }",
      python: "def countComponents(n, edges):",
      java: "public int countComponents(int n, int[][] edges) { }",
      cpp: "int countComponents(int n, vector<vector<int>>& edges) { }",
    },
  },
  {
    id: 38,
    title: "Clone Graph",
    difficulty: "Medium",
    description: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" },
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node.",
      "There are no repeated edges and no self-loops in the graph.",
      "The graph is connected.",
    ],
    functionSignature: {
      javascript: "function cloneGraph(node) { }",
      python: "def cloneGraph(node):",
      java: "public Node cloneGraph(Node node) { }",
      cpp: "Node* cloneGraph(Node* node) { }",
    },
  },
  {
    id: 39,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    description: "Given an `m x n` matrix `heights` representing the height of land at each unit cell in a continent, return a list of grid coordinates `result` where `result[i] = [ri, ci]` denotes that rain water can flow from `(ri, ci)` to both the Pacific and Atlantic oceans.",
    examples: [
      {
        input: `heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]`,
        output: `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
      },
    ],
    constraints: [
      "m == heights.length",
      "n == heights[i].length",
      "1 <= m, n <= 200",
      "0 <= heights[r][c] <= 10⁵",
    ],
    functionSignature: {
      javascript: "function pacificAtlantic(heights) { }",
      python: "def pacificAtlantic(heights):",
      java: "public List<List<Integer>> pacificAtlantic(int[][] heights) { }",
      cpp: "vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) { }",
    },
  },
  {
    id: 40,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    constraints: [
      "0 <= nums.length <= 10⁵",
      "-10⁹ <= nums[i] <= 10⁹",
    ],
    functionSignature: {
      javascript: "function longestConsecutive(nums) { }",
      python: "def longestConsecutive(nums):",
      java: "public int longestConsecutive(int[] nums) { }",
      cpp: "int longestConsecutive(vector<int>& nums) { }",
    },
  },
];

export default sampleProblems;