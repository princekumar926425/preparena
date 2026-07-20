export type Lecture = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  notes: string;
  videoUrl?: string;
  thumbnail: string;
  tags: string[];
};

export const lectures: Lecture[] = [
  {
    id: "dbms-fundamentals",
    title: "DBMS Fundamentals",
    subject: "DBMS",
    topic: "Introduction",
    description: "Relational model, normalization, SQL basics and transactions.",
    notes: "Relational model, keys, normalization (1NF, 2NF, 3NF), SQL queries, joins, transactions and indexing.",
    videoUrl: "https://www.youtube.com/embed/3EJlove8FcA",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    tags: ["DBMS", "SQL", "Basics"]
  },
  {
    id: "oops-principles",
    title: "OOPs Principles",
    subject: "OOP",
    topic: "Core Concepts",
    description: "Encapsulation, inheritance, polymorphism and abstraction explained.",
    notes: "Classes and objects, access modifiers, inheritance, polymorphism, abstraction and interfaces.",
    videoUrl: "https://www.youtube.com/embed/pTB0EiLXUC8",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80",
    tags: ["OOP", "Interview"]
  },
  {
    id: "os-scheduling",
    title: "OS Scheduling",
    subject: "OS",
    topic: "Scheduling",
    description: "CPU scheduling algorithms and process management essentials.",
    notes: "Process vs thread, scheduling algorithms, deadlocks, memory and I/O management.",
    videoUrl: "https://www.youtube.com/embed/26QPDBe-NB8",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    tags: ["OS", "Scheduling"]
  },
  {
    id: "cn-basics",
    title: "Computer Networks Basics",
    subject: "CN",
    topic: "Networking",
    description: "TCP/IP, OSI model and routing fundamentals.",
    notes: "Layered architecture, IP addressing, routing, TCP vs UDP, DNS and HTTP.",
    videoUrl: "https://www.youtube.com/embed/qiQR5rTSshw",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    tags: ["CN", "Networking"]
  }
];

export default lectures;
