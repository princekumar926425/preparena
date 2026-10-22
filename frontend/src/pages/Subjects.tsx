import { Cpu, Globe, Box, Database, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import lectures from "@/data/lectures";

const subjectData = [
  {
    id: "os", title: "Operating System", icon: Cpu,
    topics: [
      { name: "Process Management", questions: 15, notes: "Processes, threads, CPU scheduling, synchronization, deadlocks." },
      { name: "Memory Management", questions: 12, notes: "Paging, segmentation, virtual memory, page replacement algorithms." },
      { name: "File System", questions: 8, notes: "File organization, directory structure, allocation methods." },
      { name: "I/O Systems", questions: 6, notes: "I/O hardware, DMA, disk scheduling algorithms." },
    ],
  },
  {
    id: "cn", title: "Computer Networks", icon: Globe,
    topics: [
      { name: "OSI & TCP/IP Model", questions: 10, notes: "7 layers of OSI, 4 layers of TCP/IP, protocols at each layer." },
      { name: "Transport Layer", questions: 12, notes: "TCP vs UDP, flow control, congestion control, three-way handshake." },
      { name: "Network Layer", questions: 10, notes: "IP addressing, subnetting, routing algorithms, CIDR." },
      { name: "Application Layer", questions: 8, notes: "HTTP, DNS, SMTP, FTP, DHCP protocols." },
    ],
  },
  {
    id: "oops", title: "OOPs", icon: Box,
    topics: [
      { name: "Inheritance & Polymorphism", questions: 12, notes: "Types of inheritance, method overloading vs overriding, virtual functions." },
      { name: "Abstraction & Encapsulation", questions: 8, notes: "Abstract classes, interfaces, access modifiers, data hiding." },
      { name: "Design Patterns", questions: 10, notes: "Singleton, Factory, Observer, Strategy patterns." },
      { name: "SOLID Principles", questions: 6, notes: "Single responsibility, Open-closed, Liskov, Interface segregation, Dependency inversion." },
    ],
  },
  {
    id: "dbms", title: "DBMS", icon: Database,
    topics: [
      { name: "Normalization", questions: 10, notes: "1NF, 2NF, 3NF, BCNF, functional dependencies." },
      { name: "SQL Queries", questions: 15, notes: "Joins, subqueries, group by, having, aggregate functions." },
      { name: "Transactions", questions: 8, notes: "ACID properties, concurrency control, locking, deadlocks." },
      { name: "Indexing & Hashing", questions: 6, notes: "B-tree, B+ tree, hashing techniques, clustered vs non-clustered." },
    ],
  },
];

const Subjects = () => {
  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container pt-24 pb-16">
        <h1 className="mb-2 text-3xl font-bold">Core <span className="text-primary">Subjects</span></h1>
        <p className="mb-8 text-muted-foreground">Topic-wise notes and interview questions</p>

        <Tabs defaultValue="os">
          <TabsList className="mb-6 bg-card border border-border">
            {subjectData.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <s.icon className="h-4 w-4" /> {s.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjectData.map((subject) => (
            <TabsContent key={subject.id} value={subject.id} className="space-y-4">
              {subject.topics.map((topic) => (
                <div key={topic.name} className="rounded-xl border border-border bg-card p-6 transition-all hover:glow-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{topic.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground">{topic.questions} questions</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.notes}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lectures.filter((lecture) => lecture.subject.toLowerCase() === subject.id.toLowerCase()).slice(0, 2).map((lecture) => (
                      <Link key={lecture.id} to={`/lecture/${lecture.id}`} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <PlayCircle className="h-4 w-4" /> {lecture.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Subjects;