# Laravel + Inertia.js (React) Boilerplate

A clean, scalable, and highly structured boilerplate for building modern web applications using Laravel 11, React 18, Inertia.js, and Tailwind CSS. This boilerplate enforces strict architectural patterns to ensure maintainability as your project grows.

## ✨ Features

- 🔐 **Authentication & Authorization** - Built-in login, registration, and role-based access control (RBAC) using Spatie Permission.
- 🛡️ **Strict Architecture** - Enforces the `Model → Controller → Service` pattern. Thin controllers, thick services.
- 🔑 **Centralized Permissions** - All permissions are strictly managed via `App\Constants\Permissions` to prevent hardcoding.
- 📱 **Dynamic Sidebar Menu** - Database-driven hierarchical menus with automatic permission filtering.
- ⚙️ **System Settings** - Global application settings management.
- 🎨 **Modern UI Components** - Pre-configured with shadcn/ui, Tailwind CSS, and Lucide icons.
- 📊 **Reusable DataTables** - Built-in server-side pagination, sorting, and filtering components.
- 🔔 **Toast Notifications** - Integrated toast system for both frontend actions and Laravel flash messages.

## 🛠 Tech Stack

- **Backend:** Laravel 11, PHP 8.2+, MySQL/PostgreSQL
- **Frontend:** React 18, TypeScript, Inertia.js, Tailwind CSS, shadcn/ui
- **Tooling:** Vite, Pest (Testing), ESLint

## 📦 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- MySQL or PostgreSQL

### Setup Instructions

**1. Clone the repository**
```bash
git clone <your-repo-url> <project-name>
cd <project-name>
```

**2. Install Dependencies**
```bash
composer install
npm install
```

**3. Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```
Update your `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=
```

**4. Run Migrations & Seeders**
```bash
php artisan migrate:fresh --seed
```
*Note: The default seeder will populate essential roles, permissions, menus, and an admin user.*

**5. Start the Development Servers**

In terminal 1 (Laravel):
```bash
php artisan serve
```

In terminal 2 (Vite):
```bash
npm run dev
```

**6. Access the Application**
Open `http://localhost:8000` in your browser.

**Default Admin Credentials:**
- **Email:** admin@example.com
- **Password:** password

## 🏗️ Architecture & Standards

This boilerplate strictly follows the **Model → Controller → Service** pattern. 

### Core Rules:
1. **Controllers MUST be thin:** Only handle HTTP requests, validation (via FormRequests), and return Inertia responses. **NO business logic.**
2. **Services handle business logic:** All database operations, complex calculations, and data transformations belong in `app/Services`.
3. **Centralized Permissions:** Never hardcode permission strings. Always use the constants defined in `app/Constants/Permissions.php`.
4. **Policies for Authorization:** Use Laravel Policies (which utilize the Permission constants) to authorize actions.

For complete coding standards and AI instructions, please read:
👉 [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

## 📁 Key Directory Structure

```
app/
├── Constants/
│   └── Permissions.php           # Centralized permission strings
├── Http/
│   ├── Controllers/              # Thin HTTP layer
│   └── Requests/                 # Form validation rules
├── Models/                       # Eloquent models (relationships & scopes only)
├── Policies/                     # Authorization logic
└── Services/                     # Business logic layer

database/seeders/
├── Core/                         # Essential app data (Roles, Menus, Users)
├── MenuAccess/                   # Module-specific menu seeders
└── Fix/                          # Idempotent data update seeders

resources/js/
├── Components/                   # Reusable UI components (DataTable, Toast, etc.)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── Pages/                        # Inertia page components
```

## 📝 Development Workflow

### Adding a New Feature (Example: "Articles")
1. **Model & Migration:** Create `Article` model and migration.
2. **Permissions:** Add `CREATE_ARTICLES`, `READ_ARTICLES`, etc., to `app/Constants/Permissions.php`.
3. **Seeder:** Create `database/seeders/MenuAccess/Article/ArticleMenuPermissionSeeder.php` to register the menu and permissions.
4. **Policy:** Create `ArticlePolicy` using the new constants.
5. **Service:** Create `ArticleService` for business logic (create, update, delete).
6. **Requests:** Create `StoreArticleRequest` and `UpdateArticleRequest`.
7. **Controller:** Create `ArticleController` to handle HTTP and call `ArticleService`.
8. **Frontend:** Create React pages in `resources/js/Pages/Articles/`.

## 🤖 AI-Generated Documentation

All AI-generated documentation and guides are stored in the `ai-generated/` directory. These files use sequential numbering (e.g., `01-architecture.md`) for easy reading.

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
