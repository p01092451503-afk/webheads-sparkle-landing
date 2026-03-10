
-- 1. 고객사 프로젝트 관리 테이블
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.client_companies(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  contract_amount BIGINT DEFAULT 0,
  contract_start_date DATE,
  contract_end_date DATE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read client_projects"
  ON public.client_projects FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage client_projects"
  ON public.client_projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 2. 커뮤니케이션 로그 테이블
CREATE TABLE public.client_comm_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.client_companies(id) ON DELETE CASCADE NOT NULL,
  log_type TEXT NOT NULL DEFAULT 'memo',
  title TEXT,
  content TEXT,
  logged_by UUID,
  log_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_comm_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read client_comm_logs"
  ON public.client_comm_logs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage client_comm_logs"
  ON public.client_comm_logs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 3. 반복 업무 체크리스트 테이블
CREATE TABLE public.monthly_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL,
  month INT NOT NULL,
  task_name TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.monthly_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read monthly_checklists"
  ON public.monthly_checklists FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage monthly_checklists"
  ON public.monthly_checklists FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 4. 기본 체크리스트 템플릿 테이블 (매월 자동 생성용)
CREATE TABLE public.checklist_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read checklist_templates"
  ON public.checklist_templates FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage checklist_templates"
  ON public.checklist_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- 기본 체크리스트 템플릿 데이터 삽입
INSERT INTO public.checklist_templates (task_name, sort_order) VALUES
  ('세금계산서 발행 완료', 1),
  ('매출 입금 확인', 2),
  ('매입/지출 정리', 3),
  ('미수금 확인 및 독촉', 4),
  ('월간 매출 리포트 생성', 5),
  ('고객사 계약 갱신 확인', 6);
