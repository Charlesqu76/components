"use client";
import Barrage from "@/components/barrage";
import { Input } from "@/components/Input";

export default function Home() {
  return (
    <div className="p-4">
      <Input placeholder="placeholder" />
      <Barrage
        config={{
          lineNum: 2,
        }}
        data={[
          { name: "Nextjs" },
          { name: "React" },
          { name: "Vue" },
          { name: "Angular" },
        ]}
        renderItem={({ name }) => (
          <div className="first-letter:capitalize px-2">{name}</div>
        )}
      />
    </div>
  );
}
