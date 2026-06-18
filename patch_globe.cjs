const fs = require("fs");
const p = "src/Components/UI/globe-demo.tsx";
let c = fs.readFileSync(p, "utf8");
const re =
  /          <p className="text-center text-base md:text-sm[\s\S]*?        <\/motion.div>/;
const rep = `          <p
            className="text-center text-base md:text-lg font-normal max-w-xl mt-4 mx-auto leading-relaxed"
            style={{ color: "#a0a0b0" }}
          >
            Born in{" "}
            <span style={{ color: "#175aff" }}>Benin City</span>, scaling across{" "}
            <span style={{ color: "#175aff" }}>Nigeria</span> and beyond. Ridely
            is building the infrastructure for smarter, faster deliveries — one
            city at a time, connecting communities worldwide.
          </p>
        </motion.div>

        <div
          className="absolute w-full bottom-0 inset-x-0 h-40 pointer-events-none select-none z-40"
          style={{
            background: "linear-gradient(to bottom, transparent, #0a0a0f)",
          }}
        />`;
c = c.replace(re, rep);
fs.writeFileSync(p, c);
console.log("done");
