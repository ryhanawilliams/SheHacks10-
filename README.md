## Inspiration
Circl. was inspired by a simple but alarming reality: waste is everywhere, and most of it still has value. In Canada, the majority of consumer waste ends up in landfills, reinforcing a linear use-and-dispose mindset. We wanted to challenge that norm by helping people see everyday objects not as trash, but as opportunities. Our goal was to make upcycling accessible, visual, and actionable for anyone.

## What it does
We built Circl., a web-based platform where users can upload an image of any object and receive AI-generated upcycling ideas. Circl. identifies the object, suggests creative reuse projects, and provides step-by-step instructions supported by both text and images. By lowering the barrier to upcycling, we aim to keep materials in circulation longer and promote more sustainable habits.

## How we built it
Our frontend was built using React, creating a clean and intuitive user experience. On the backend, we used ExpressJS to handle API requests and application logic, with Supabase managing authentication and data storage. For intelligence and creativity, we integrated the Gemini API to analyze uploaded images and generate upcycling recommendations. We also leveraged Nano banana to assist with generating sequential visual steps for each project, making instructions easier to follow and more engaging.

## Challenges we ran into
One of our biggest challenges was generating clear, step-by-step instructions that remained consistent across different objects and use cases. Prompt tuning required multiple iterations to ensure logical ordering and usable results. Integrating multiple technologies across the stack within a limited timeframe also pushed us to work efficiently and communicate clearly as a team.

## Accomplishments that we're proud of
We are especially proud that Circl. consistently generates upcycling ideas and crafts that we would genuinely use ourselves. Seeing the AI produce realistic, creative, and actionable projects validated our core idea and showed us the real-world potential of the product. We also pushed ourselves by working with a new technology stack we had never used before, rapidly learning and integrating multiple tools under tight time constraints. Building a functional, end-to-end AI-powered product in such a short timeframe was a major milestone for our team.

## What we learned
This was our first time implementing AI as a core feature rather than a supporting tool. We learned how to design prompts that produce structured, sequential outputs and how to integrate generative AI into a real-time user workflow. We also gained experience balancing creativity with reliability, ensuring AI outputs were both inspiring and practical.

## What's next for circl.
Next, we want to expand Circl. into a more community-driven platform. This includes allowing users to save, share, and rate upcycling projects, as well as contribute their own ideas. We also plan to improve personalization by tailoring recommendations based on user preferences, available tools, and skill level. Long term, we see Circl. becoming a hub for circular living, helping people reduce waste not just occasionally, but as part of their everyday habits.

## Watch our demo:
https://youtu.be/XqBWX-uugeQ?si=Rs5mts5DYcXJRx2t
