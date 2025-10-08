# KenyaDevJobs - A Smart Job Board for Kenyan Tech Professionals

![KenyaDevJobs Screenshot](https://github.com/Denniskaninu/smart-dev-kenya-jobs-finder/blob/main/docs/image.png?raw=true)

Welcome to the repository for **KenyaDevJobs**, a modern, AI-powered job board designed specifically for the vibrant tech community in Kenya. This project was built to solve a simple problem: cutting through the noise to find legitimate, high-quality tech jobs.

## About The Project

The tech scene in Kenya is booming, but finding the right job can be challenging. Job seekers often have to sift through countless listings, some of which are outdated, irrelevant, or even fraudulent. I built KenyaDevJobs to address this by creating a centralized, reliable, and user-friendly platform.

This isn't just another job aggregator. It's a smart tool that leverages cutting-edge technology to deliver a superior user experience.

### Key Features:

*   **AI-Powered Legitimacy Check:** Utilizes Google's Gemini model via Genkit to analyze job postings and automatically flag suspicious or fake listings, ensuring users only see credible opportunities.
*   **AI-Powered Company Scanner:** A unique feature that allows users to scan for jobs at a curated list of top tech companies in Kenya.
*   **Advanced Filtering & Search:** Users can instantly search by keywords and apply multiple filters for categories (Frontend, Backend), job types (Full-time, Internship), work models (Remote, Hybrid), and posting date.
*   **Modern, Responsive UI:** The interface is built with Next.js and ShadCN UI for a clean, fast, and fully responsive experience on any device.
*   **Dark Mode:** A sleek, user-friendly dark mode for comfortable browsing, anytime.
*   **Monetization-Ready:** Includes a "Post a Job" page, laying the groundwork for future monetization through featured job listings.

---

## Tech Stack

This project was built with a modern, production-ready tech stack, prioritizing performance, developer experience, and scalability.

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Generative AI:** [Genkit (Google Gemini)](https://firebase.google.com/docs/genkit)

---

## How It Works

1.  **Job Aggregation:** The application uses a static list of jobs in `src/lib/jobs.ts` to simulate a database of scraped job postings.
2.  **Frontend Rendering:** The Next.js App Router is used for server-side rendering and fast page loads. Most of the interactivity is handled by React Client Components.
3.  **AI Verification:** When a user clicks "Apply Now" on a job, the `filterFakeJobs` Genkit flow is triggered. It sends the job details to the Gemini Pro model with a specific prompt to assess legitimacy. If the AI flags the job as a potential scam, it warns the user.
4.  **AI Scanning:** The "Scan Top Companies" feature uses another Genkit flow (`scanJobsByCompany`) that leverages a Genkit tool (`findJobsTool`) to search the internal job list for specific employers. This demonstrates the power of AI function calling.
5.  **State Management:** Client-side state for filters and UI is managed with React hooks (`useState`, `useMemo`).

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/KenyaDevJobs.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root and add your Google AI API key:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - youremail@example.com

Project Link: [https://github.com/your_username/KenyaDevJobs](https://github.com/your_username/KenyaDevJobs)
