-- JS Playground — Full Database Import Script
-- Run this against a fresh PostgreSQL database:
--   psql -U <user> -d <dbname> -f import.sql

-- ─────────────────────────────────────────────
-- 1. SCHEMA
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS problems (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  difficulty  TEXT NOT NULL,
  category    TEXT NOT NULL,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  starter_code TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_cases (
  id          SERIAL PRIMARY KEY,
  problem_id  TEXT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input       TEXT NOT NULL,
  expected    TEXT NOT NULL,
  sort_order  SERIAL
);

CREATE TABLE IF NOT EXISTS snippets (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  code       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. PROBLEMS SEED DATA
-- ─────────────────────────────────────────────

INSERT INTO problems (id, title, difficulty, category, tags, description, starter_code) VALUES

('two-sum', 'Two Sum', 'Easy', 'Arrays', ARRAY['array','hash-table'],
'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
```',
'/**
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
'),

('valid-parentheses', 'Valid Parentheses', 'Easy', 'Stack', ARRAY['string','stack'],
'Given a string `s` containing just the characters `''(''`, `'')''`, `''{''`, `''}''`, `''[''` and `'']''`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.

**Example:**
```
Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false
```',
'/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here
}

console.log(isValid("()"));      // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
'),

('reverse-linked-list', 'Reverse Linked List', 'Easy', 'Linked List', ARRAY['linked-list','recursion'],
'Given the `head` of a singly linked list, reverse the list, and return the reversed list.

**Example:**
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

For this problem, simulate with a plain array or a simple ListNode class.',
'class ListNode {
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
'),

('maximum-subarray', 'Maximum Subarray', 'Medium', 'Dynamic Programming', ARRAY['array','dynamic-programming','divide-and-conquer'],
'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

**Example:**
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
```',
'/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your solution here (Kadane''s Algorithm)
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6
console.log(maxSubArray([1]));                       // 1
console.log(maxSubArray([5,4,-1,7,8]));              // 23
'),

('climbing-stairs', 'Climbing Stairs', 'Easy', 'Dynamic Programming', ARRAY['math','dynamic-programming','memoization'],
'You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

**Example:**
```
Input: n = 3
Output: 3
Explanation: 1+1+1, 1+2, 2+1
```',
'/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your solution here
}

console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3
console.log(climbStairs(5)); // 8
'),

('binary-search', 'Binary Search', 'Easy', 'Binary Search', ARRAY['array','binary-search'],
'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with `O(log n)` runtime complexity.

**Example:**
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
```',
'/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Your solution here
}

console.log(search([-1,0,3,5,9,12], 9));  // 4
console.log(search([-1,0,3,5,9,12], 2));  // -1
'),

('merge-intervals', 'Merge Intervals', 'Medium', 'Arrays', ARRAY['array','sorting'],
'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example:**
```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```',
'/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Your solution here
}

console.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))); // [[1,6],[8,10],[15,18]]
console.log(JSON.stringify(merge([[1,4],[4,5]])));                // [[1,5]]
'),

('lru-cache', 'LRU Cache', 'Medium', 'Design', ARRAY['hash-table','linked-list','design'],
'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the `LRUCache` class:
- `LRUCache(int capacity)` — Initialize the LRU cache with positive size `capacity`.
- `int get(int key)` — Return the value of the `key` if it exists, otherwise return `-1`.
- `void put(int key, int value)` — Update the value of the key if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, evict the least recently used key.

**Example:**
```
["LRUCache","put","put","get","put","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]
```',
'class LRUCache {
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
'),

('word-search', 'Word Search', 'Medium', 'Backtracking', ARRAY['array','backtracking','matrix'],
'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically adjacent). The same letter cell may not be used more than once.

**Example:**
```
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
word = "ABCCED"
Output: true
```',
'/**
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
'),

('number-of-islands', 'Number of Islands', 'Medium', 'Graph', ARRAY['array','depth-first-search','breadth-first-search','union-find','matrix'],
'Given an `m x n` 2D binary grid `grid` which represents a map of `''1''`s (land) and `''0''`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**Example:**
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```',
'/**
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
'),

('longest-substring', 'Longest Substring Without Repeating Characters', 'Medium', 'Sliding Window', ARRAY['hash-table','string','sliding-window'],
'Given a string `s`, find the length of the longest substring without repeating characters.

**Example:**
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```',
'/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your solution here (sliding window)
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb"));    // 1
console.log(lengthOfLongestSubstring("pwwkew"));   // 3
'),

('trapping-rain-water', 'Trapping Rain Water', 'Hard', 'Two Pointers', ARRAY['array','two-pointers','dynamic-programming','stack','monotonic-stack'],
'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

**Example:**
```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```',
'/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Your solution here
}

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
console.log(trap([4,2,0,3,2,5]));              // 9
'),

('median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard', 'Binary Search', ARRAY['array','binary-search','divide-and-conquer'],
'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.

**Example:**
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000

Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
```',
'/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Your solution here
}

console.log(findMedianSortedArrays([1,3], [2]));      // 2.0
console.log(findMedianSortedArrays([1,2], [3,4]));    // 2.5
')

ON CONFLICT (id) DO UPDATE SET
  title        = EXCLUDED.title,
  difficulty   = EXCLUDED.difficulty,
  category     = EXCLUDED.category,
  tags         = EXCLUDED.tags,
  description  = EXCLUDED.description,
  starter_code = EXCLUDED.starter_code;

-- ─────────────────────────────────────────────
-- 3. TEST CASES
-- ─────────────────────────────────────────────

-- Clear existing test cases (safe to re-run)
DELETE FROM test_cases WHERE problem_id IN (
  'two-sum','valid-parentheses','reverse-linked-list','maximum-subarray',
  'climbing-stairs','binary-search','merge-intervals','lru-cache',
  'word-search','number-of-islands','longest-substring',
  'trapping-rain-water','median-of-two-sorted-arrays'
);

INSERT INTO test_cases (problem_id, input, expected) VALUES
-- Two Sum
('two-sum', 'twoSum([2,7,11,15], 9)', '[0,1]'),
('two-sum', 'twoSum([3,2,4], 6)',      '[1,2]'),
('two-sum', 'twoSum([3,3], 6)',        '[0,1]'),

-- Valid Parentheses
('valid-parentheses', 'isValid("()")',      'true'),
('valid-parentheses', 'isValid("()[]{}")', 'true'),
('valid-parentheses', 'isValid("(]")',      'false'),

-- Reverse Linked List
('reverse-linked-list', 'listToArray(reverseList(arrayToList([1,2,3,4,5])))', '[5,4,3,2,1]'),
('reverse-linked-list', 'listToArray(reverseList(arrayToList([1,2])))',        '[2,1]'),

-- Maximum Subarray
('maximum-subarray', 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', '6'),
('maximum-subarray', 'maxSubArray([1])',                       '1'),
('maximum-subarray', 'maxSubArray([5,4,-1,7,8])',              '23'),

-- Climbing Stairs
('climbing-stairs', 'climbStairs(2)', '2'),
('climbing-stairs', 'climbStairs(3)', '3'),
('climbing-stairs', 'climbStairs(5)', '8'),

-- Binary Search
('binary-search', 'search([-1,0,3,5,9,12], 9)', '4'),
('binary-search', 'search([-1,0,3,5,9,12], 2)', '-1'),

-- Merge Intervals
('merge-intervals', 'JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))', '"[[1,6],[8,10],[15,18]]"'),
('merge-intervals', 'JSON.stringify(merge([[1,4],[4,5]]))',                '"[[1,5]]"'),

-- LRU Cache
('lru-cache', 'cache.get(1) after put(1,1),put(2,2),get(1),put(3,3)', '1 then -1'),

-- Word Search
('word-search', 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")', 'true'),
('word-search', 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")',    'true'),

-- Number of Islands
('number-of-islands', 'numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])', '1'),
('number-of-islands', 'numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])', '3'),

-- Longest Substring
('longest-substring', 'lengthOfLongestSubstring("abcabcbb")', '3'),
('longest-substring', 'lengthOfLongestSubstring("bbbbb")',    '1'),
('longest-substring', 'lengthOfLongestSubstring("pwwkew")',   '3'),

-- Trapping Rain Water
('trapping-rain-water', 'trap([0,1,0,2,1,0,1,3,2,1,2,1])', '6'),
('trapping-rain-water', 'trap([4,2,0,3,2,5])',              '9'),

-- Median of Two Sorted Arrays
('median-of-two-sorted-arrays', 'findMedianSortedArrays([1,3], [2])',   '2'),
('median-of-two-sorted-arrays', 'findMedianSortedArrays([1,2], [3,4])', '2.5');
