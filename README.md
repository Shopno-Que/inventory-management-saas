### Inventory management system (SAAS)

This is a inventory management saas MVP's repo.

### Codebase Introduction

This project follows a consistent development workflow and folder structure. Please follow these conventions when contributing.

1. **Package Manager**

   * We use **pnpm** as the project's package manager. 

2. **Framework**

   * Built with **Next.js 16** using the **App Router**.
   * The project does **not** use a `src` directory.

3. **Styling**

   * **Tailwind CSS** is used for styling.
   * **DaisyUI** is used to maintain a consistent and reusable UI across the application.

4. **Language**

   * JavaScript is the default choice.
   * Use **TypeScript only where it provides real value**, such as complex logic, shared types, or improved type safety.

5. **Code Formatting**

   * **Biome** is used for code formatting and linting.
   * Always format your code before committing.

6. **Loading Experience**

   * We use **nextjs-toploader** for page navigation progress.
   * Use Next.js built-in **Skeleton Loading UI** (`loading.js/tsx`) to improve the user experience during data fetching.

7. **Icons**

   * Use **react-icons** for all application icons.

8. **Project Structure**

   * The project follows the **Next.js 16 App Router** directory structure.
   * Do not introduce a `src` folder.

9. **Components**

   * All reusable components are located in the root-level `components/` directory.
   * Components are organized into subdirectories based on the feature or section where they are used.
   * Keep components modular, reusable, and easy to locate.
