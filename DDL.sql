-- ============================================
--   SCHEMA EMPLOYABILITY
-- ============================================
CREATE SCHEMA IF NOT EXISTS employability;
SET search_path TO employability;

-- ============================================
-- 1. TABLAS CATÁLOGO
-- ============================================

-- 1.1 Catálogo de estados del coder
CREATE TABLE coder_status_catalog (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO coder_status_catalog (status_name)
VALUES ('active'), ('inactive'), ('graduated');

-- 1.2 Catálogo de seniority
CREATE TABLE seniority_catalog (
    seniority_id SERIAL PRIMARY KEY,
    seniority_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO seniority_catalog (seniority_name)
VALUES ('junior'), ('mid'), ('senior');

-- 1.3 Catálogo de modalidad
CREATE TABLE modality_catalog (
    modality_id SERIAL PRIMARY KEY,
    modality_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO modality_catalog (modality_name)
VALUES ('remote'), ('hybrid'), ('onsite');

-- 1.4 Catálogo de estado de aplicación
CREATE TABLE application_status_catalog (
    application_status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO application_status_catalog (status_name)
VALUES ('applied'), ('reviewed'), ('shortlisted'), ('rejected'), ('hired');

-- 1.5 Catálogo de resultado de entrevistas
CREATE TABLE interview_outcome_catalog (
    outcome_id SERIAL PRIMARY KEY,
    outcome_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO interview_outcome_catalog (outcome_name)
VALUES ('pending'), ('pass'), ('fail');

-- 1.6 Catálogo de Tipos de Roles (para usuarios de la plataforma)
CREATE TABLE role_catalog (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Coder', 'Staff Empleabilidad', 'Admin'
);

INSERT INTO role_catalog (role_name)
VALUES ('Coder'), ('Staff Empleabilidad'), ('Admin');

-- ============================================
-- 2. CODERS & USUARIOS
-- ============================================

-- 2.1 Usuarios (Incluye a coders y staff de empleabilidad)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Para autenticación
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2.2 Relación Coder (Detalles específicos del Coder)
CREATE TABLE coders (
    coder_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE, -- Clave foránea a users
    phone VARCHAR(20),
    status_id INT NOT NULL REFERENCES coder_status_catalog(status_id)
);

-- 2.3 Roles del Usuario (N:N entre Users y Role_Catalog)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES role_catalog(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);


-- ============================================
-- 3. SKILLS
-- ============================================
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    skill_type VARCHAR(50) NOT NULL -- technical / soft
);

-- ============================================
-- 4. CODER SKILLS & EVALUACIONES (Perfil Técnico y Socioemocional)
-- ============================================

-- 4.1 CODER SKILLS (N:N) - Perfil Técnico y Habilidades Blandas
CREATE TABLE coder_skills (
    coder_id UUID REFERENCES coders(coder_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20), -- basic / intermediate / advanced
    PRIMARY KEY (coder_id, skill_id)
);

-- 4.2 CODER ASSESSMENTS - INTEGRACIÓN PERFIL SOCIOEMOCIONAL (Nuevo)
-- Para registrar resultados de pruebas específicas (personalidad, aptitudes, etc.)
CREATE TABLE coder_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coder_id UUID REFERENCES coders(coder_id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) NOT NULL, -- Ej: 'Test Big 5', 'Aptitud Lógica', 'Habilidades Interpersonales'
    score DECIMAL(5,2),
    assessment_date DATE,
    details TEXT,
    staff_user_id UUID REFERENCES users(user_id) -- Usuario que cargó/realizó la evaluación
);

-- ============================================
-- 5. VACANTES
-- ============================================
CREATE TABLE vacancies (
    vacancy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    modality_id INT REFERENCES modality_catalog(modality_id),
    seniority_id INT REFERENCES seniority_catalog(seniority_id),
    salary_range VARCHAR(100),
    description TEXT,
    posted_at TIMESTAMP DEFAULT NOW(),
    posted_by UUID REFERENCES users(user_id), -- Quién del equipo de empleabilidad la publicó
    active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 6. VACANCY SKILLS (N:N)
-- ============================================
CREATE TABLE vacancy_skills (
    vacancy_id UUID REFERENCES vacancies(vacancy_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (vacancy_id, skill_id)
);

-- ============================================
-- 7. POSTULACIONES
-- ============================================
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coder_id UUID REFERENCES coders(coder_id) ON DELETE CASCADE,
    vacancy_id UUID REFERENCES vacancies(vacancy_id) ON DELETE CASCADE,
    application_status_id INT NOT NULL REFERENCES application_status_catalog(application_status_id), -- Estado actual
    applied_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. TRAZABILIDAD DE ESTADOS DE POSTULACIÓN (Nuevo)
-- Para permitir el filtrado, análisis y seguimiento completo del flujo del candidato
-- ============================================
CREATE TABLE application_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(application_id) ON DELETE CASCADE,
    application_status_id INT NOT NULL REFERENCES application_status_catalog(application_status_id),
    change_date TIMESTAMP DEFAULT NOW(),
    changed_by UUID REFERENCES users(user_id), -- Quién realizó el cambio (Staff de Empleabilidad)
    notes TEXT
);


-- ============================================
-- 9. ENTREVISTAS
-- ============================================
CREATE TABLE interviews (
    interview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(application_id) ON DELETE CASCADE,
    interview_date TIMESTAMP NOT NULL,
    interviewer_user_id UUID REFERENCES users(user_id), -- Usamos el ID del usuario
    outcome_id INT REFERENCES interview_outcome_catalog(outcome_id),
    notes TEXT
);

-- ============================================
-- 10. CONTRATACIONES
-- ============================================
CREATE TABLE hires (
    hire_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(application_id) ON DELETE CASCADE,
    hire_date TIMESTAMP NOT NULL,
    contract_type VARCHAR(50)
);

-- ============================================
-- 11. ÍNDICES PARA ANALÍTICA Y RENDIMIENTO
-- ============================================

CREATE INDEX idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX idx_applications_coder ON applications(coder_id);
CREATE INDEX idx_vacancy_active ON vacancies(active);
CREATE INDEX idx_skills_type ON skills(skill_type);
CREATE INDEX idx_status_history_application ON application_status_history(application_id);
CREATE INDEX idx_coder_assessments_coder ON coder_assessments(coder_id);

-- ============================================
-- FIN DDL
-- ============================================