import re

path = "src/Components/UI/globe-demo.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_motion = """        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center text-2xl md:text-4xl font-extrabold text-white">
            Ridely's Global Vision
          </h2>
          <p
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
        />"""

pattern = r"        <motion\.div\s+initial=\{\{[\s\S]*?</motion\.div>"
content, n = re.subn(pattern, new_motion, content, count=1)
print(f"replaced {n} block(s)")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
