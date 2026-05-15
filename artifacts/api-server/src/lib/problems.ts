export interface TestCase {
  input: string;
  expected: string;
}

export interface ProblemDetail {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

export type Problem = Pick<ProblemDetail, "id" | "title" | "difficulty" | "category" | "tags">;

export const PROBLEMS: ProblemDetail[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "hash-table"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\``,
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
}

// Test
console.log(JSON.stringify(twoSum([2,7,11,15], 9)));   // [0,1]
console.log(JSON.stringify(twoSum([3,2,4], 6)));        // [1,2]
`,
    testCases: [
      { input: "twoSum([2,7,11,15], 9)", expected: "[0,1]" },
      { input: "twoSum([3,2,4], 6)", expected: "[1,2]" },
      { input: "twoSum([3,3], 6)", expected: "[0,1]" },
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    tags: ["string", "stack"],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.

**Example:**
\`\`\`
Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false
\`\`\``,
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here
}

console.log(isValid("()"));      // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
`,
    testCases: [
      { input: 'isValid("()")', expected: "true" },
      { input: 'isValid("()[]{}")', expected: "true" },
      { input: 'isValid("(]")', expected: "false" },
    ],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    tags: ["linked-list", "recursion"],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

**Example:**
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

For this problem, simulate with a plain array or a simple ListNode class.`,
    starterCode: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function arrayToList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    head = new ListNode(arr[i], head);
  }
  return head;
}

function listToArray(head) {
  const result = [];
  while (head) { result.push(head.val); head = head.next; }
  return result;
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Your solution here
}

console.log(JSON.stringify(listToArray(reverseList(arrayToList([1,2,3,4,5])))));  // [5,4,3,2,1]
`,
    testCases: [
      { input: "listToArray(reverseList(arrayToList([1,2,3,4,5])))", expected: "[5,4,3,2,1]" },
      { input: "listToArray(reverseList(arrayToList([1,2])))", expected: "[2,1]" },
    ],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["array", "dynamic-programming", "divide-and-conquer"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

**Example:**
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\``,
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your solution here (Kadane's Algorithm)
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6
console.log(maxSubArray([1]));                       // 1
console.log(maxSubArray([5,4,-1,7,8]));              // 23
`,
    testCases: [
      { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expected: "6" },
      { input: "maxSubArray([1])", expected: "1" },
      { input: "maxSubArray([5,4,-1,7,8])", expected: "23" },
    ],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: ["math", "dynamic-programming", "memoization"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

**Example:**
\`\`\`
Input: n = 3
Output: 3
Explanation: 1+1+1, 1+2, 2+1
\`\`\``,
    starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your solution here
}

console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3
console.log(climbStairs(5)); // 8
`,
    testCases: [
      { input: "climbStairs(2)", expected: "2" },
      { input: "climbStairs(3)", expected: "3" },
      { input: "climbStairs(5)", expected: "8" },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    tags: ["array", "binary-search"],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

**Example:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
\`\`\``,
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Your solution here
}

console.log(search([-1,0,3,5,9,12], 9));  // 4
console.log(search([-1,0,3,5,9,12], 2));  // -1
`,
    testCases: [
      { input: "search([-1,0,3,5,9,12], 9)", expected: "4" },
      { input: "search([-1,0,3,5,9,12], 2)", expected: "-1" },
    ],
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["array", "sorting"],
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example:**
\`\`\`
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
\`\`\``,
    starterCode: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Your solution here
}

console.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))); // [[1,6],[8,10],[15,18]]
console.log(JSON.stringify(merge([[1,4],[4,5]])));                // [[1,5]]
`,
    testCases: [
      { input: "JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))", expected: '"[[1,6],[8,10],[15,18]]"' },
      { input: "JSON.stringify(merge([[1,4],[4,5]]))", expected: '"[[1,5]]"' },
    ],
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Design",
    tags: ["hash-table", "linked-list", "design"],
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` — Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` — Return the value of the \`key\` if it exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` — Update the value of the key if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, evict the least recently used key.

**Example:**
\`\`\`
["LRUCache","put","put","get","put","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]
\`\`\``,
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // Initialize your data structures here
  }

  get(key) {
    // Return value or -1
  }

  put(key, value) {
    // Insert or update
  }
}

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));    // 1
cache.put(3, 3);
console.log(cache.get(2));    // -1 (evicted)
cache.put(4, 4);
console.log(cache.get(1));    // -1 (evicted)
console.log(cache.get(3));    // 3
console.log(cache.get(4));    // 4
`,
    testCases: [
      { input: "cache.get(1) after put(1,1),put(2,2),get(1),put(3,3)", expected: "1 then -1" },
    ],
  },
  {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    tags: ["array", "backtracking", "matrix"],
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically adjacent). The same letter cell may not be used more than once.

**Example:**
\`\`\`
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
word = "ABCCED"
Output: true
\`\`\``,
    starterCode: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board, word) {
  // Your solution here (DFS + backtracking)
}

const board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
console.log(exist(board, "ABCCED")); // true
console.log(exist(board, "SEE"));    // true
console.log(exist(board, "ABCB"));   // false
`,
    testCases: [
      { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")', expected: "true" },
      { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")', expected: "true" },
    ],
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**Example:**
\`\`\`
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
\`\`\``,
    starterCode: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Your solution here (BFS or DFS)
}

console.log(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
])); // 1

console.log(numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
])); // 3
`,
    testCases: [
      { input: 'numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])', expected: "1" },
      { input: 'numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])', expected: "3" },
    ],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    tags: ["hash-table", "string", "sliding-window"],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

**Example:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\``,
    starterCode: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your solution here (sliding window)
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3
`,
    testCases: [
      { input: 'lengthOfLongestSubstring("abcabcbb")', expected: "3" },
      { input: 'lengthOfLongestSubstring("bbbbb")', expected: "1" },
      { input: 'lengthOfLongestSubstring("pwwkew")', expected: "3" },
    ],
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    tags: ["array", "two-pointers", "dynamic-programming", "stack", "monotonic-stack"],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

**Example:**
\`\`\`
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
\`\`\``,
    starterCode: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Your solution here
}

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
console.log(trap([4,2,0,3,2,5]));              // 9
`,
    testCases: [
      { input: "trap([0,1,0,2,1,0,1,3,2,1,2,1])", expected: "6" },
      { input: "trap([4,2,0,3,2,5])", expected: "9" },
    ],
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    tags: ["array", "binary-search", "divide-and-conquer"],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.

**Example:**
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000

Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
\`\`\``,
    starterCode: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Your solution here
}

console.log(findMedianSortedArrays([1,3], [2]));      // 2.0
console.log(findMedianSortedArrays([1,2], [3,4]));    // 2.5
`,
    testCases: [
      { input: "findMedianSortedArrays([1,3], [2])", expected: "2" },
      { input: "findMedianSortedArrays([1,2], [3,4])", expected: "2.5" },
    ],
  },
];

export function getProblems(category?: string, difficulty?: string): Problem[] {
  let filtered = PROBLEMS;
  if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (difficulty) filtered = filtered.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  return filtered.map(({ id, title, difficulty, category, tags }) => ({ id, title, difficulty, category, tags }));
}

export function getProblemById(id: string): ProblemDetail | undefined {
  return PROBLEMS.find((p) => p.id === id);
}

export function getProblemStats() {
  const byDifficulty: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const p of PROBLEMS) {
    byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] ?? 0) + 1;
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
  }

  return { total: PROBLEMS.length, byDifficulty, byCategory };
}
