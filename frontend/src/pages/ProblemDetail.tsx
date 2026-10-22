import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Send } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { problems, type Difficulty } from "@/data/problems";
import { api } from "@/lib/api";

const difficultyClass: Record<Difficulty, string> = {
  Easy: "bg-easy/15 text-easy border-easy/30",
  Medium: "bg-medium/15 text-medium border-medium/30",
  Hard: "bg-hard/15 text-hard border-hard/30",
};

const defaultCode: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from PrepArena" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from PrepArena");
    }
}`,
  python: `print("Hello from PrepArena")`,
};

const twoSumStarterCode: Record<string, string> = {
  cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    cin >> target;

    unordered_map<int, int> indices;
    for (int i = 0; i < n; ++i) {
        int complement = target - nums[i];
        if (indices.count(complement)) {
            cout << indices[complement] << " " << i << endl;
            return 0;
        }
        indices[nums[i]] = i;
    }
    return 0;
}`,
  java: `import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();
        int target = scanner.nextInt();

        Map<Integer, Integer> indices = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (indices.containsKey(complement)) {
                System.out.println(indices.get(complement) + " " + i);
                return;
            }
            indices.put(nums[i], i);
        }
    }
}`,
  python: `import sys

data = list(map(int, sys.stdin.read().split()))
n = data[0]
nums = data[1:n + 1]
target = data[n + 1]

indices = {}
for i, value in enumerate(nums):
    complement = target - value
    if complement in indices:
        print(indices[complement], i)
        break
    indices[value] = i`,
};

const initialInput = problems.find((item) => item.id === "two-sum")?.examples[0]?.input || "";
const starterCodeFor = (problemId: string | undefined, lang: string) => (
  problemId === "two-sum" ? twoSumStarterCode[lang] : defaultCode[lang]
);

type JudgeResult = {
  testCase: number;
  hidden: boolean;
  verdict: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  error?: string | null;
  time?: string | number | null;
  memory?: number | null;
};

type SubmissionResult = {
  verdict: string;
  passed: number;
  total: number;
  message: string;
  results: JudgeResult[];
};

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === id);

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(() => starterCodeFor(problem?.id, "cpp"));
  const [stdin, setStdin] = useState(() => problem?.id === "two-sum" ? initialInput : "");
  const [output, setOutput] = useState("Run your solution to see output here.");
  const [outputIsError, setOutputIsError] = useState(false);
  const [executionDetails, setExecutionDetails] = useState("");
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [activeAction, setActiveAction] = useState<"run" | "submit" | null>(null);

  useEffect(() => {
    setLanguage("cpp");
    setCode(starterCodeFor(problem?.id, "cpp"));
    setStdin(problem?.id === "two-sum" ? initialInput : "");
    setOutput("Run your solution to see output here.");
    setOutputIsError(false);
    setExecutionDetails("");
    setSubmission(null);
  }, [problem?.id]);

  if (!problem) return <div className="p-8">Problem not found</div>;

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(starterCodeFor(problem.id, lang));
    setSubmission(null);
  };

  const runCode = async (mode: "run" | "submit" = "run") => {
    setActiveAction(mode);
    setOutput(mode === "submit" ? "Submitting solution..." : "Compiling and running...");
    setOutputIsError(false);
    setExecutionDetails("");
    setSubmission(null);

    try {
      if (mode === "run") {
        const data = await api<{
          verdict: string;
          stdout: string;
          stderr: string;
          time: string | number | null;
          memory: number | null;
        }>("/code/run", {
          method: "POST",
          body: JSON.stringify({ code, language, problemId: problem.id, stdin }),
        });
        setOutput(data.stdout || (data.verdict === "Accepted" ? "(No output)" : data.verdict));
        setOutputIsError(data.verdict !== "Accepted");
        setExecutionDetails([
          data.verdict,
          data.time !== null ? `Time: ${data.time}s` : "",
          data.memory !== null ? `Memory: ${data.memory} KB` : "",
          data.stderr ? `\n${data.stderr}` : "",
        ].filter(Boolean).join(" · "));
      } else {
        const data = await api<SubmissionResult>("/code/submit", {
          method: "POST",
          body: JSON.stringify({ code, language, problemId: problem.id }),
        });
        setSubmission(data);
        setOutput(data.message);
        setOutputIsError(data.verdict !== "Accepted");
      }
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Unable to contact the code execution service.");
      setOutputIsError(true);
      setExecutionDetails("Request failed");
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link to="/dsa" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-border">|</span>
          <h1 className="font-semibold">{problem.title}</h1>
          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${difficultyClass[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        {problem.leetcodeUrl && (
          <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
            Open on LeetCode
          </a>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[32%] border-r border-border overflow-y-auto bg-background/70 p-4">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Problem Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {problem.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Examples</h3>
              <div className="mt-2 space-y-3">
                {problem.examples.map((example, index) => (
                  <div key={index} className="rounded-lg border border-border bg-card/70 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Example {index + 1}</p>
                    <p className="mt-2 text-sm"><span className="font-semibold">Input:</span> {example.input}</p>
                    <p className="text-sm"><span className="font-semibold">Output:</span> {example.output}</p>
                    {example.explanation ? (
                      <p className="mt-2 text-sm text-muted-foreground">{example.explanation}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Constraints</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {problem.id === "two-sum"
                  ? "Input: n, then n space-separated integers, then target (each on its own line). Output: the two distinct indices, separated by whitespace. Run uses the editable stdin below; Submit checks public and hidden cases."
                  : "Standard input/output execution and grading are not configured for this problem yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <div className="flex gap-2">
              {['cpp', 'java', 'python'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  disabled={Boolean(activeAction)}
                  className={`rounded-md px-3 py-1 text-xs ${language === lang ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {lang === "cpp" ? "C++" : lang === "python" ? "Python 3" : "Java"}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={Boolean(activeAction)} onClick={() => runCode("run")}>
                <Play className="mr-2 h-3 w-3" /> {activeAction === "run" ? "Running..." : "Run"}
              </Button>
              <Button size="sm" disabled={Boolean(activeAction)} onClick={() => runCode("submit")}>
                <Send className="mr-2 h-3 w-3" /> {activeAction === "submit" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
            />
          </div>

          {problem.id === "two-sum" && (
            <label className="border-t border-border bg-background p-3 text-xs text-muted-foreground">
              Standard input (stdin)
              <textarea
                aria-label="Standard input"
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                disabled={Boolean(activeAction)}
                className="mt-2 h-20 w-full resize-y rounded-md border border-border bg-black p-2 font-mono text-xs text-foreground disabled:opacity-70"
                spellCheck={false}
              />
            </label>
          )}

          <div className="h-32 overflow-auto border-t border-border bg-black p-3 font-mono text-sm text-green-400">
            {executionDetails && <p className="mb-2 whitespace-pre-wrap text-xs text-muted-foreground">{executionDetails}</p>}
            <pre className={`whitespace-pre-wrap ${outputIsError ? "text-red-300" : "text-green-400"}`}>{output}</pre>
          </div>

          {submission && (
            <div className="max-h-[30vh] overflow-auto border-t border-border bg-slate-950 p-3 text-xs text-slate-200">
              <h3 className={`mb-2 font-semibold ${submission.verdict === "Accepted" ? "text-emerald-300" : "text-red-300"}`}>
                Submission: {submission.verdict} · {submission.passed}/{submission.total} test cases passed
              </h3>
              <div className="space-y-2">
                {submission.results.map((test) => (
                  <div key={test.testCase} className="rounded-md border border-slate-700 bg-slate-900 p-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold">
                        Test {test.testCase}{test.hidden ? " (hidden)" : ""}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-[11px] ${test.verdict === "Accepted" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                        {test.verdict}
                      </span>
                    </div>
                    {!test.hidden && (
                      <>
                        <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-400"><strong>Input:</strong> {test.input}</p>
                        <p className="whitespace-pre-wrap text-[11px] text-slate-400"><strong>Expected:</strong> {test.expectedOutput}</p>
                        <p className="whitespace-pre-wrap text-[11px] text-slate-400"><strong>Output:</strong> {test.actualOutput}</p>
                      </>
                    )}
                    {test.error && <p className="mt-1 whitespace-pre-wrap text-[11px] text-red-300"><strong>Error:</strong> {test.error}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[24%] border-l border-border p-4">
          <h3 className="text-sm font-semibold">Editorial / Hint</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {problem.editorial || "A detailed explanation will be added here soon."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;