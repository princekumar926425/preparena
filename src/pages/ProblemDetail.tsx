import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Send } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { problems, type Difficulty } from "@/data/problems";

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

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === id);

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultCode.cpp);
  const [output, setOutput] = useState("Run your solution to see output here.");
  const [testResults, setTestResults] = useState<any[]>([]);

  if (!problem) return <div className="p-8">Problem not found</div>;

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(defaultCode[lang]);
  };

  const runCode = async (mode: "run" | "submit" = "run") => {
    setOutput(mode === "submit" ? "Submitting..." : "Running...");
    setTestResults([]);

    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, problemId: problem.id, mode: mode === "submit" ? "judge" : "run" }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setOutput(`Server error: ${data?.message || res.statusText || "Unknown error"}`);
        return;
      }

      if (mode === "submit") {
        setTestResults(data.results || []);
        setOutput(data.results ? `Judge run complete: ${data.results.filter((r) => r.verdict === "Passed").length}/${data.results.length} passed.` : "No judge results");
      } else {
        if (data?.output && data.output.trim() !== "") {
          setOutput(data.output);
        } else {
          setOutput("No output");
        }
      }
    } catch (err) {
      setOutput(`Error running code: ${err instanceof Error ? err.message : String(err)}`);
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
                The platform uses standard input/output style for coding practice. You can solve the problem in your preferred language and test it here.
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
                  className={`rounded-md px-3 py-1 text-xs ${language === lang ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => runCode("run")}>
                <Play className="mr-2 h-3 w-3" /> Run
              </Button>
              <Button size="sm" onClick={() => runCode("submit")}>
                <Send className="mr-2 h-3 w-3" /> Submit
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

          <div className="h-32 border-t border-border bg-black p-3 font-mono text-sm text-green-400 overflow-auto">
            {output}
          </div>

          {testResults.length > 0 && (
            <div className="border-t border-border bg-slate-950 p-3 text-xs text-slate-200">
              <h3 className="font-semibold mb-2">Judge Results</h3>
              <div className="space-y-2">
                {testResults.map((test, index) => (
                  <div key={index} className="rounded-md border border-slate-700 p-2 bg-slate-900">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold">Test {index + 1}</span>
                      <span className={`rounded-full px-2 py-1 text-[11px] ${test.verdict === "Passed" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                        {test.verdict}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400"><strong>Input:</strong> {test.input}</p>
                    <p className="text-[11px] text-slate-400"><strong>Expected:</strong> {test.expectedOutput}</p>
                    <p className="text-[11px] text-slate-400"><strong>Output:</strong> {test.actualOutput}</p>
                    {test.error ? <p className="text-[11px] text-red-300"><strong>Error:</strong> {test.error}</p> : null}
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