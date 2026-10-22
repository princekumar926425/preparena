export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  topic: string;
  leetcodeUrl?: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  editorial?: string;
  videoUrl?: string;
}

export const dsaTopics = [
  "Arrays", "Strings", "Linked List", "Stack & Queue", "Trees",
  "Graphs", "Dynamic Programming", "Binary Search", "Recursion", "Greedy",
  "Heap", "Trie", "Bit Manipulation", "Sliding Window", "Two Pointers",
];

export const problems: Problem[] = [
  {
    id: "two-sum", title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Map"],
    topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,18], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    ],
    editorial: "Use a hash map concept to store each number's index. For each element, check if target - current exists in the map. Time: O(n), Space: O(n).",
    videoUrl: "https://www.youtube.com/embed/KLlXCFG5TnA",
  },
  {
    id: "best-time-to-buy-sell", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", tags: ["Array", "Sliding Window"],
    topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy and a single day to sell.\n\nReturn the maximum profit you can achieve.",
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }],
    editorial: "Track minimum price seen so far and calculate profit at each step.",
  },
  {
    id: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "DP", "Divide & Conquer"],
    topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }],
    editorial: "Kadane's Algorithm: maintain current sum and max sum. Reset current sum to 0 when it goes negative.",
  },
  {
    id: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", tags: ["Array", "Sorting"],
    topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
  },
  {
    id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", tags: ["Linked List", "Recursion"],
    topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
    editorial: "Use three pointers: prev, curr, next. Iterate through the list reversing each link.",
  },
  {
    id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack", "String"],
    topic: "Stack & Queue", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [{ input: 's = "([])"', output: "true" }],
  },
  {
    id: "binary-tree-inorder", title: "Binary Tree Inorder Traversal", difficulty: "Easy", tags: ["Tree", "DFS", "Stack"],
    topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [{ input: "root = [1,null,2,3]", output: "[1,3,2]" }],
  },
  {
    id: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", tags: ["DP", "Math"],
    topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }],
  },
  {
    id: "longest-common-subseq", title: "Longest Common Subsequence", difficulty: "Medium", tags: ["DP", "String"],
    topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: "3" }],
  },
  {
    id: "number-of-islands", title: "Number of Islands", difficulty: "Medium", tags: ["Graph", "BFS", "DFS"],
    topic: "Graphs", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
    examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: "2" }],
  },
  {
    id: "binary-search", title: "Binary Search", difficulty: "Easy", tags: ["Array", "Binary Search"],
    topic: "Binary Search", leetcodeUrl: "https://leetcode.com/problems/binary-search/",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
  },
  {
    id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", tags: ["Array", "Two Pointers", "Stack"],
    topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    editorial: "Use two pointers from both ends. Track left_max and right_max. Water at each position = min(left_max, right_max) - height[i].",
  },
  {
  id: "boat-to-save-people",
  title: "Boats to Save People",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers", "Greedy"],
  topic: "Array",

  leetcodeUrl: "https://leetcode.com/problems/boats-to-save-people/description/",

  description: `You are given an array people where people[i] is the weight of the ith person, 
and an infinite number of boats where each boat can carry a maximum weight of limit. 

Each boat carries at most two people at the same time, provided the sum of the weight 
of those people is at most limit.

Return the minimum number of boats to carry every given person.`,

  examples: [
    {
      input: "people = [1,2], limit = 3",
      output: "1",
      explanation: "1 + 2 = 3, so both can share one boat."
    },
    {
      input: "people = [3,2,2,1], limit = 3",
      output: "3",
      explanation: "Boats: (1,2), (2), (3)"
    },
    {
      input: "people = [3,5,3,4], limit = 5",
      output: "4",
      explanation: "Each person goes alone because no pair fits within limit."
    }
  ],


}
];