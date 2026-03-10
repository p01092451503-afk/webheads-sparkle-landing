import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RawRow {
  bn: string; num: string; name: string; ceo: string; bt: string; bi: string;
  zip: string; a1: string; a2: string; cn: string; cp: string; cd: string;
  ct: string; cm: string; ce: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // All rows from Excel
  const rows: RawRow[] = [
{"bn":"107-87-36590","num":"","name":"(주) 모바코리아","ceo":"이강호","bt":"서비스 외","bi":"정보통신서비스 외","zip":"150093","a1":"서울 영등포구 문래동3가","a2":"에이스하이테크시티 4동 410호","cn":"이강호","cp":"대표","cd":"","ct":"02-2671-0880","cm":"01025040880","ce":"mobakorea@naver.com"},
{"bn":"220-81-34078","num":"","name":"(주) 수로텍","ceo":"정성은","bt":"제조 외","bi":"영상 및 음향기기 제조 외","zip":"08502","a1":"서울특별시 금천구 가산디지털1로 212, 504호","a2":"(가산동, 코오롱디지털애스턴)","cn":"김혜지","cp":"","cd":"경영지원본부","ct":"","cm":"02-6278-1125","ce":"surotech@surotech.com"},
{"bn":"105-86-05167","num":"","name":"(주)알티베이스","ceo":"김성진","bt":"서비스 외","bi":"소프트웨어자문, 개발및공급 외","zip":"152790","a1":"서울 구로구 구로3동","a2":"대륭포스타워 2차 10층","cn":"이시현","cp":"과장","cd":"","ct":"02-2082-1022","cm":"","ce":"sunbeam1981@altibase.com"},
{"bn":"105-86-05167","num":"","name":"(주)알티베이스","ceo":"김성진","bt":"서비스 외","bi":"소프트웨어자문, 개발및공급 외","zip":"152790","a1":"서울 구로구 구로3동","a2":"대륭포스타워 2차 10층","cn":"김수남","cp":"팀장","cd":"","ct":"","cm":"010-2658-7803","ce":"esou@naver.com"},
{"bn":"211-86-73937","num":"","name":"(주)이미지이십일","ceo":"하민회","bt":"서비스 외","bi":"교육컨설팅및홍보대행 외","zip":"06155","a1":"서울특별시 강남구 삼성로 557","a2":"2층 201호 (삼성동)","cn":"김성순","cp":"실장","cd":"","ct":"02-540-3835","cm":"","ce":"yhd5189@naver.com"},
{"bn":"121-81-43552","num":"","name":"관세법인에이원","ceo":"정운기,송창석","bt":"서비스","bi":"관세사","zip":"135010","a1":"서울 강남구 언주로 703","a2":"3층 (논현동)","cn":"이건영","cp":"계장","cd":"경영기획팀","ct":"0220173322","cm":"01037771852","ce":"lk0309@aonecustoms.com"},
{"bn":"206-91-11379","num":"","name":"닻별언어연구소","ceo":"권오성","bt":"서비스업","bi":"문제출제, 원고교정, 편집","zip":"143190","a1":"서울 광진구 자양동","a2":"","cn":"하지인","cp":"","cd":"","ct":"07076421224","cm":"01040560266","ce":"jessie722@hanmail.net"},
{"bn":"121-81-29114","num":"","name":"인천국제공항공사","ceo":"이학재","bt":"서비스 외","bi":"공항설비운영 외","zip":"400700","a1":"인천 중구 공항로 424번길","a2":"47(운서동)","cn":"김윤성","cp":"과장","cd":"경비보안처","ct":"","cm":"010-6479-3501","ce":"yoonsung_kim@airport.kr"},
{"bn":"106-82-14642","num":"","name":"재단법인 한국보육진흥원","ceo":"서문희","bt":"비영리","bi":"비영리","zip":"04303","a1":"서울특별시 용산구 청파로 345","a2":"(서계동, 5,6층)","cn":"이소연","cp":"","cd":"","ct":"02-6901-0282","cm":"","ce":"sylee0131@kcpi.or.kr"},
{"bn":"206-31-93552","num":"","name":"버터텅","ceo":"백정승","bt":"서비스","bi":"교육서비스","zip":"133800","a1":"서울 성동구 금호동1가","a2":"행당로 3길 12 401호","cn":"백정승","cp":"대표","cd":"","ct":"","cm":"010-2905-4304","ce":"memeory43@naver.com"},
{"bn":"114-82-03452","num":"44","name":"(사) 한국감정평가사협회","ceo":"양길수","bt":"부동산, 출판, 금융 외","bi":"임대업, 일반서적 외","zip":"06705","a1":"서울특별시 서초구 방배로 52","a2":"(방배동)","cn":"김지나","cp":"과장","cd":"","ct":"","cm":"","ce":"rlawlsk86@kapanet.or.kr"},
{"bn":"114-82-03452","num":"44","name":"(사) 한국감정평가사협회","ceo":"양길수","bt":"부동산, 출판, 금융 외","bi":"임대업, 일반서적 외","zip":"06705","a1":"서울특별시 서초구 방배로 52","a2":"(방배동)","cn":"고동균","cp":"","cd":"","ct":"","cm":"","ce":"kdk513@kapanet.or.kr"},
{"bn":"121-82-00808","num":"","name":"(재) 인천교구천주교회유지재단","ceo":"정신철","bt":"비영리","bi":"비영리","zip":"22573","a1":"인천광역시 동구 박문로 1","a2":"(송림동)","cn":"김기라","cp":"","cd":"인천교구선교사목부","ct":"","cm":"","ce":"mission@caincheon.or.kr"},
{"bn":"114-82-05111","num":"","name":"(재) 한국마약퇴치운동본부","ceo":"서국진","bt":"서비스","bi":"마약퇴치사업","zip":"07212","a1":"서울특별시 영등포구 선유동2로 57, 14층","a2":"(양평동4가, 이레빌딩)","cn":"문지영","cp":"","cd":"","ct":"02-6929-3188","cm":"","ce":"eor3188@drugfree.kr"},
{"bn":"107-82-11478","num":"","name":"(재) 한국에너지재단","ceo":"김광식","bt":"서비스(사업관련)업, 전기","bi":"광고대행, 광고물작성, 기타광고, 태양광발전","zip":"04337","a1":"서울특별시 용산구 신흥로 152","a2":"(후암동, 한국에너지재단)","cn":"한혜심","cp":"차장","cd":"","ct":"0269132167","cm":"","ce":"hshan@koref.or.kr"},
{"bn":"107-82-11478","num":"","name":"(재) 한국에너지재단","ceo":"김광식","bt":"서비스(사업관련)업, 전기","bi":"광고대행, 광고물작성, 기타광고, 태양광발전","zip":"04337","a1":"서울특별시 용산구 신흥로 152","a2":"(후암동, 한국에너지재단)","cn":"장규식","cp":"팀장","cd":"","ct":"0269132120","cm":"","ce":"jks8919@koref.or.kr"},
{"bn":"219-82-00333","num":"","name":"(재) 한국장애인개발원","ceo":"최경숙","bt":"서비스, 부동산업 외","bi":"기타(인증) 외","zip":"07236","a1":"서울특별시 영등포구 의사당대로 22","a2":"(여의도동, 이룸센터 5층)","cn":"이지수","cp":"","cd":"인사총무팀","ct":"02-3433-0687","cm":"","ce":"jisoo0612@koddi.or.kr"},
{"bn":"104-82-10922","num":"","name":"(재) 한국장학재단","ceo":"곽병선","bt":"금융","bi":"학자금지원, 장학사업","zip":"04527","a1":"서울특별시 중구 통일로 10","a2":"(남대문로 5가, 연세세브란스빌딩 19층)","cn":"이승준","cp":"","cd":"","ct":"053-238-2473","cm":"","ce":"workstudy@kosaf.go.kr"},
{"bn":"107-82-14534","num":"","name":"(재)한국화학융합시험연구원","ceo":"변종립","bt":"서비스","bi":"시험, 검사, 기술용역","zip":"13810","a1":"경기도 과천시 교육원로 98","a2":"(중앙동)","cn":"최용수","cp":"선임연구원","cd":"행정안전팀","ct":"02-2164-0059","cm":"010-4190-8323","ce":"mik8787@ktr.or.kr"},
  ];

  // Group by business_number + company_name
  const companyMap = new Map<string, { company: any; contacts: any[] }>();
  
  for (const r of rows) {
    const key = `${r.bn}___${r.name}`;
    if (!companyMap.has(key)) {
      companyMap.set(key, {
        company: {
          business_number: r.bn,
          num: r.num || null,
          company_name: r.name,
          ceo_name: r.ceo || null,
          business_type: r.bt || null,
          business_item: r.bi || null,
          zip_code: r.zip || null,
          address1: r.a1 || null,
          address2: r.a2 || null,
        },
        contacts: [],
      });
    }
    // Add contact if there's any info
    if (r.cn || r.ce || r.ct || r.cm) {
      companyMap.get(key)!.contacts.push({
        name: r.cn || null,
        position: r.cp || null,
        department: r.cd || null,
        phone: r.ct || null,
        mobile: r.cm || null,
        email: r.ce || null,
      });
    }
  }

  let companyCount = 0;
  let contactCount = 0;

  for (const [, val] of companyMap) {
    const { data: co, error: coErr } = await supabase
      .from("client_companies")
      .insert(val.company)
      .select("id")
      .single();
    
    if (coErr) {
      console.error("Company insert error:", coErr, val.company.company_name);
      continue;
    }
    companyCount++;

    if (val.contacts.length > 0) {
      const contactsWithId = val.contacts.map(c => ({ ...c, company_id: co.id }));
      const { error: ctErr } = await supabase.from("client_contacts").insert(contactsWithId);
      if (ctErr) console.error("Contact insert error:", ctErr);
      else contactCount += val.contacts.length;
    }
  }

  return new Response(JSON.stringify({ success: true, companies: companyCount, contacts: contactCount }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
