import { useState, useEffect, useRef } from "react";

const MAIN_PURPLE = "#6C4EF6";
const SELF_BUILD_COST = 60_000_000;

function useCountUp(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    if (start === target) return;
    const startTime = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
      else prevRef.current = target;
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const fmt = (n: number) => n.toLocaleString("ko-KR");

export default function RoiCalculator() {
  const [monthly, setMonthly] = useState(700_000);

  const breakEvenMonths = Math.round(SELF_BUILD_COST / monthly);
  const threeYearWebheads = monthly * 36;
  const threeYearSaving = SELF_BUILD_COST - threeYearWebheads;
  const isSavingPositive = threeYearSaving > 0;

  const displayBreakEven = useCountUp(breakEvenMonths);
  const displayThreeYearWh = useCountUp(threeYearWebheads);
  const displayThreeYearSaving = useCountUp(Math.abs(threeYearSaving));

  // Break-even color logic
  const getBepStyle = () => {
    if (breakEvenMonths <= 12) return { bg: "#fff", border: "#16A34A", text: "#16A34A" };
    if (breakEvenMonths <= 24) return { bg: "#fff", border: "#D97706", text: "#D97706" };
    return { bg: "#fff", border: "#9CA3AF", text: "#6B7280" };
  };
  const bepStyle = getBepStyle();

  const sliderPercent = ((monthly - 300_000) / (2_000_000 - 300_000)) * 100;

  return (
    <section id="roi-calculator" className="py-16 md:py-28" style={{ background: "#fff" }}>
      <div className="mx-auto px-5 md:px-6" style={{ maxWidth: 900 }}>
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-extrabold text-2xl md:text-4xl tracking-tight mb-3" style={{ color: "#111827" }}>
            LMS 도입 비용, 직접 계산해보세요
          </h2>
          <p className="text-sm md:text-base" style={{ color: "#9CA3AF" }}>
            초기 구축비 차이만으로 충분합니다
          </p>
        </div>

        {/* 2-column */}
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-6 md:gap-8 items-start">

          {/* ── LEFT: Slider Panel ── */}
          <div
            className="md:sticky md:top-6 rounded-2xl bg-white border p-6 md:p-8"
            style={{ borderColor: "#E5E7EB", maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}
          >
            <label className="block text-sm font-semibold mb-5" style={{ color: "#374151" }}>
              월 이용료 선택
            </label>

            <div className="text-center mb-6">
              <span className="text-4xl font-extrabold" style={{ color: MAIN_PURPLE }}>
                {fmt(monthly)}
              </span>
              <span className="text-base font-semibold ml-1" style={{ color: MAIN_PURPLE }}>원</span>
            </div>

            <input
              type="range"
              min={300_000}
              max={2_000_000}
              step={100_000}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
              style={{
                background: `linear-gradient(to right, ${MAIN_PURPLE} ${sliderPercent}%, #E5E7EB ${sliderPercent}%)`,
              }}
            />
            <div className="flex justify-between text-xs mb-4" style={{ color: "#9CA3AF" }}>
              <span>30만원</span>
              <span>200만원</span>
            </div>
            <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
              규모에 따라 30만~200만원 수준
            </p>
          </div>

          {/* ── RIGHT: Results Panel ── */}
          <div className="flex flex-col gap-6">

            {/* Block 1: 최초 구축비 비교 */}
            <div>
              <h3 className="font-bold text-base mb-4" style={{ color: "#111827" }}>최초 구축비</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {/* 자체 구축 */}
                <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>자체 구축</p>
                  <p className="font-extrabold text-4xl mb-3" style={{ color: "#EF4444" }}>
                    60,000,000<span className="text-lg">원</span>
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                    개발 기간 6~12개월 소요
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                    유지보수·업데이트 별도 발생
                  </p>
                </div>

                {/* VS badge */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-white hidden sm:flex"
                  style={{ border: "1px solid #E5E7EB", color: "#9CA3AF" }}
                >
                  VS
                </div>

                {/* 웹헤즈 */}
                <div className="rounded-2xl p-6" style={{ background: "#fff", border: "2px solid #16A34A" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>웹헤즈 LMS</p>
                  <p className="font-extrabold text-4xl mb-3" style={{ color: "#16A34A" }}>
                    0<span className="text-lg">원</span>
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#16A34A" }}>
                    계약 후 즉시 도입 가능
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#16A34A" }}>
                    업데이트·유지보수 포함
                  </p>
                </div>
              </div>
            </div>

            {/* Block 2: 손익분기점 */}
            <div
              className="rounded-2xl p-6 md:p-8 text-center transition-colors duration-300"
              style={{ background: bepStyle.bg, border: `1px solid ${bepStyle.border}` }}
            >
              <h3 className="font-bold text-base mb-5" style={{ color: "#111827" }}>
                웹헤즈 도입 시 손익분기점
              </h3>
              <p className="font-extrabold text-5xl md:text-6xl mb-2" style={{ color: bepStyle.text }}>
                {displayBreakEven}<span className="text-2xl md:text-3xl">개월 후 본전</span>
              </p>
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                = 월 이용료 {fmt(monthly)}원 기준
              </p>
              <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#6B7280" }}>
                자체 구축에 6,000만원을 쓰는 대신,{" "}
                웹헤즈를 {displayBreakEven}개월 이용하면 같은 비용이 됩니다.
                <br />
                그 이후부터는 순수 절감입니다.
              </p>
            </div>

            {/* Block 3: 3년 총비용 비교 */}
            <div className="rounded-2xl p-6 md:p-8 bg-white" style={{ border: "1px solid #E5E7EB" }}>
              <h3 className="font-bold text-base mb-5" style={{ color: "#111827" }}>
                3년(36개월) 총 비용 비교
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="text-center">
                  <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>자체 구축</p>
                  <p className="font-bold text-xl md:text-2xl" style={{ color: "#EF4444" }}>
                    {fmt(SELF_BUILD_COST)}<span className="text-sm">원</span>
                  </p>
                  {/* Bar */}
                  <div className="mt-3 mx-auto rounded-full overflow-hidden" style={{ height: 8, background: "#E5E7EB" }}>
                    <div className="h-full rounded-full" style={{ width: "100%", background: "#EF4444" }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>웹헤즈 LMS</p>
                  <p className="font-bold text-xl md:text-2xl" style={{ color: MAIN_PURPLE }}>
                    {fmt(displayThreeYearWh)}<span className="text-sm">원</span>
                  </p>
                  {/* Bar */}
                  <div className="mt-3 mx-auto rounded-full overflow-hidden" style={{ height: 8, background: "#EDE9FE" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (threeYearWebheads / SELF_BUILD_COST) * 100)}%`,
                        background: MAIN_PURPLE,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Saving result */}
              {isSavingPositive ? (
                <div className="text-center rounded-xl py-4 px-6" style={{ background: "#F0FDF4" }}>
                  <p className="font-extrabold text-2xl md:text-3xl" style={{ color: "#16A34A" }}>
                    3년간 {fmt(displayThreeYearSaving)}원 절감
                  </p>
                </div>
              ) : (
                <div className="text-center rounded-xl py-4 px-6" style={{ background: "#FFF7ED" }}>
                  <p className="font-bold text-lg" style={{ color: "#D97706" }}>
                    자체 구축이 유리합니다
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    (3년간 {fmt(displayThreeYearSaving)}원 차이)
                  </p>
                </div>
              )}
            </div>

            {/* 하단 안내 */}
            <div className="text-xs leading-relaxed space-y-1" style={{ color: "#9CA3AF" }}>
              <p>※ 운영비(서버, 전송량, 저장공간)는 자체 구축과 임대형 모두 유사한 수준으로 비교에서 제외했습니다.</p>
              <p>※ 실제 구축비는 기능 범위에 따라 다를 수 있으며, 정확한 견적은 상담을 통해 안내드립니다.</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 hover:opacity-90"
              style={{ background: MAIN_PURPLE }}
            >
              맞춤 견적 상담 신청하기 →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
