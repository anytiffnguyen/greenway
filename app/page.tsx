
"use client";

import { useState, type FormEvent } from "react";

type UserType = "tourist" | "runner" | "courier" | "senior";

type RouteData = {
  name: string;
  distance: number;
  duration: number;
  aqi: number;
  pm25: number;
  description: string;
  tag: string;
};

const userTypes: { value: UserType; label: string; emoji: string }[] = [
  { value: "tourist", label: "Khách du lịch", emoji: "🧳" },
  { value: "runner", label: "Người chạy bộ", emoji: "🏃" },
  { value: "courier", label: "Shipper", emoji: "🛵" },
  { value: "senior", label: "Người cao tuổi", emoji: "🌼" },
];

const routeData: { normal: RouteData; green: RouteData } = {
  normal: {
    name: "Tuyến đường ngắn nhất",
    distance: 5.2,
    duration: 18,
    aqi: 126,
    pm25: 54,
    description:
      "Tuyến ngắn hơn nhưng trong bản demo có mức ô nhiễm không khí cao hơn.",
    tag: "Nhanh hơn",
  },
  green: {
    name: "GreenWay Route",
    distance: 6.1,
    duration: 23,
    aqi: 58,
    pm25: 18,
    description:
      "Tuyến thay thế ưu tiên không gian xanh và giả lập mức ô nhiễm thấp hơn.",
    tag: "Ưu tiên không gian xanh",
  },
};

const safetyTips: Record<UserType, string[]> = {
  tourist: [
    "Kiểm tra chất lượng không khí trước khi tham quan ngoài trời.",
    "Mang theo nước uống và hạn chế đi bộ lâu khi không khí ô nhiễm.",
    "Kiểm tra lại tuyến đường thực tế trước khi khởi hành.",
  ],
  runner: [
    "Cân nhắc giảm cường độ hoặc chuyển sang tập trong nhà khi chất lượng không khí kém.",
    "Ưu tiên thời điểm và khu vực có chất lượng không khí tốt hơn.",
    "Không dựa vào dữ liệu demo để quyết định cường độ tập luyện.",
  ],
  courier: [
    "Kiểm tra tình hình giao thông và công trình trên đường đi.",
    "Chuẩn bị khẩu trang phù hợp khi cần di chuyển trong môi trường nhiều bụi.",
    "Ưu tiên an toàn giao thông thay vì chỉ chọn tuyến đường ngắn nhất.",
  ],
  senior: [
    "Ưu tiên tuyến đường thuận tiện, có chỗ nghỉ và vỉa hè an toàn.",
    "Tránh hoạt động ngoài trời khi chất lượng không khí ở mức xấu.",
    "Nếu có bệnh hô hấp hoặc tim mạch, hãy làm theo hướng dẫn của nhân viên y tế.",
  ],
};

function getAqiLabel(aqi: number) {
  if (aqi <= 50) return "Tốt";
  if (aqi <= 100) return "Trung bình";
  if (aqi <= 150) return "Không tốt cho nhóm nhạy cảm";
  if (aqi <= 200) return "Kém";
  if (aqi <= 300) return "Rất kém";
  return "Nguy hại";
}

function getAqiColor(aqi: number) {
  if (aqi <= 50) return "text-green-700 bg-green-50";
  if (aqi <= 100) return "text-lime-800 bg-lime-50";
  if (aqi <= 150) return "text-orange-700 bg-orange-50";
  if (aqi <= 200) return "text-red-700 bg-red-50";
  return "text-purple-700 bg-purple-50";
}

export default function Home() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [userType, setUserType] = useState<UserType>("tourist");
  const [departureTime, setDepartureTime] = useState("08:00");
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

const [language, setLanguage] = useState<"vi" | "en">("vi");

const translations = {
  vi: {
    tagline: "Di chuyển thông minh hơn, sống xanh hơn",
    howItWorks: "Cách hoạt động",
    start: "Điểm xuất phát",
    destination: "Điểm đến",
    userType: "Bạn là ai?",
    departureTime: "Thời gian khởi hành",
    compareRoutes: "So sánh tuyến đường",
    shortestRoute: "Tuyến đường ngắn nhất",
    greenRoute: "Tuyến đường xanh hơn",
    distance: "Khoảng cách",
    airQuality: "Chất lượng không khí",
    search: "Tìm tuyến đường",
    tourist: "Khách du lịch",
    runner: "Người chạy bộ",
    shipper: "Shipper",
    elderly: "Người cao tuổi",
  },
  en: {
    tagline: "Smarter mobility, greener living",
    howItWorks: "How it works",
    start: "Starting point",
    destination: "Destination",
    userType: "Who are you?",
    departureTime: "Departure time",
    compareRoutes: "Compare routes",
    shortestRoute: "Shortest route",
    greenRoute: "Greener alternative",
    distance: "Distance",
    airQuality: "Air quality",
    search: "Find routes",
    tourist: "Tourist",
    runner: "Runner",
    shipper: "Delivery driver",
    elderly: "Older adult",
  },
};

const t = translations[language];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!start.trim() || !destination.trim()) {
      setError("B hãy nhập cả điểm xuất phát và điểm đến nhé.");
      setShowResults(false);
      return;
    }

    if (start.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("Điểm xuất phát và điểm đến không nên giống nhau.");
      setShowResults(false);
      return;
    }

    setError("");
    setShowResults(true);
  }

  function handleReset() {
    setStart("");
    setDestination("");
    setUserType("tourist");
    setDepartureTime("08:00");
    setShowResults(false);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f7f9f5] text-slate-800">
      <div className="flex justify-end gap-2 px-5 py-3 sm:px-8">
  <button
    type="button"
    onClick={() => setLanguage("vi")}
    className={`rounded-full px-4 py-2 text-sm font-semibold ${
      language === "vi"
        ? "bg-green-700 text-white"
        : "border border-gray-300 text-gray-700"
    }`}
  >
    VI 🇻🇳
  </button>

  <button
    type="button"
    onClick={() => setLanguage("en")}
    className={`rounded-full px-4 py-2 text-sm font-semibold ${
      language === "en"
        ? "bg-green-700 text-white"
        : "border border-gray-300 text-gray-700"
    }`}
  >
    EN 🇬🇧
  </button>
</div>
      <nav className="border-b border-green-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-xl text-white">
              🌿
            </span>
            <span className="text-xl font-extrabold tracking-tight text-green-900">
              GreenWay
            </span>
          </a>
          <a
            href="#how-it-works"
            className="hidden text-sm font-medium text-slate-600 hover:text-green-700 sm:block"
          >
            {t.howItWorks}
          </a>
          <a
            href="#planner"
            className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            Tìm tuyến đường
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-green-100">
              <span>🌍</span>
              <span>{t.tagline}</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your journey,
              <br />
              <span className="text-lime-300">a greener way.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-green-100 sm:text-lg">
              Không chỉ tìm đường ngắn nhất. GreenWay hướng đến việc giúp bạn
              cân nhắc chất lượng không khí và lựa chọn cách di chuyển phù hợp
              hơn với nhu cầu của mình.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#planner"
                className="rounded-full bg-lime-300 px-6 py-3 font-bold text-green-950 hover:bg-lime-200"
              >
                Khám phá GreenWay →
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Tìm hiểu thêm
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-green-100">
              <span>🌳 Không gian xanh</span>
              <span>💨 Chất lượng không khí</span>
              <span>🧭 Lựa chọn linh hoạt</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Minh họa hành trình</p>
                  <h2 className="mt-1 text-xl font-bold">A greener city</h2>
                </div>
                <span className="rounded-full bg-lime-300/20 px-3 py-1.5 text-sm font-semibold text-lime-200">
                  Demo
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f7f9f5] p-5 text-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">
                    📍
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Điểm xuất phát</p>
                    <p className="font-semibold">Your location</p>
                  </div>
                </div>

                <div className="my-2 ml-5 h-7 border-l-2 border-dashed border-green-400" />

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lg">
                    🌳
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Điểm đến</p>
                    <p className="font-semibold">Your destination</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-500">Tuyến ngắn nhất</p>
                    <p className="mt-1 text-2xl font-black">5.2 km</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs text-green-700">GreenWay Route</p>
                    <p className="mt-1 text-2xl font-black text-green-800">
                      6.1 km
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Số liệu minh họa, không phải dữ liệu giao thông hoặc chất
                  lượng không khí theo thời gian thực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planner" className="scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Your journey starts here
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Lên kế hoạch di chuyển
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Nhập thông tin hành trình để xem bản so sánh tuyến đường minh họa
              và gợi ý phù hợp với nhu cầu của bạn.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-green-950/5 sm:p-8">
            <form onSubmit={handleSearch}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                <label htmlFor="start" className="mb-2 block text-sm font-bold text-slate-700">
                 {t.start}
                </label>
                  <input
                    id="start"
                    value={start}
                    onChange={(event) => setStart(event.target.value)}
                    placeholder="Ví dụ: Hồ Gươm, Hà Nội"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="mb-2 block text-sm font-bold text-slate-700">
                    Điểm đến
                  </label>
                  <input
                    id="destination"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    placeholder="Ví dụ: Văn Miếu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label htmlFor="userType" className="mb-2 block text-sm font-bold text-slate-700">
                    Bạn là ai?
                  </label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(event) => setUserType(event.target.value as UserType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  >
                    {userTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="departureTime" className="mb-2 block text-sm font-bold text-slate-700">
                    Thời gian khởi hành
                  </label>
                  <input
                    id="departureTime"
                    type="time"
                    value={departureTime}
                    onChange={(event) => setDepartureTime(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-700 px-6 py-4 font-bold text-white shadow-lg hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
                >
                  🌿 So sánh tuyến đường
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 px-6 py-4 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đặt lại
                </button>
              </div>
            </form>
          </div>

          {showResults && (
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="mb-7 text-center">
                <p className="text-sm font-semibold text-green-700">KẾT QUẢ MINH HỌA</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {start.trim()} → {destination.trim()}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Khởi hành lúc {departureTime} · {userTypes.find((type) => type.value === userType)?.label}
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>Chế độ demo:</strong> Các tuyến đường dưới đây sử dụng số liệu mẫu cố định. Ứng dụng chưa tính tuyến đường thật từ địa điểm bạn nhập.
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-2xl">🚗</span>
                  <h4 className="mt-3 text-xl font-extrabold text-slate-900">
                    Tuyến đường ngắn nhất
                  </h4>
                  <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    Nhanh hơn
                  </span>

                  <div className="my-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Khoảng cách</p>
                      <p className="mt-1 text-2xl font-black">5.2 km</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Thời gian mẫu</p>
                      <p className="mt-1 text-2xl font-black">18 phút</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 py-4">
                    <span className="text-sm font-semibold text-slate-600">Chỉ số AQI</span>
                    <div className="text-right">
                      <p className="text-2xl font-black">126</p>
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                        Không tốt cho nhóm nhạy cảm
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 py-4">
                    <span className="text-sm font-semibold text-slate-600">PM2.5 (mẫu)</span>
                    <span className="font-bold">54 µg/m³</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tuyến ngắn hơn nhưng trong bản demo có mức ô nhiễm không khí cao hơn.
                  </p>
                </article>

                <article className="relative overflow-hidden rounded-3xl border-2 border-green-600 bg-white p-6 shadow-xl shadow-green-900/5">
                  <div className="absolute right-0 top-0 rounded-bl-2xl bg-green-700 px-4 py-2 text-xs font-bold text-white">
                    GREENWAY PICK
                  </div>
                  <span className="text-2xl">🌿</span>
                  <h4 className="mt-3 text-xl font-extrabold text-green-900">
                    GreenWay Route
                  </h4>
                  <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    Ưu tiên không gian xanh
                  </span>

                  <div className="my-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-green-50 p-4">
                      <p className="text-xs text-green-700">Khoảng cách</p>
                      <p className="mt-1 text-2xl font-black text-green-900">6.1 km</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 p-4">
                      <p className="text-xs text-green-700">Thời gian mẫu</p>
                      <p className="mt-1 text-2xl font-black text-green-900">23 phút</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-green-100 py-4">
                    <span className="text-sm font-semibold text-slate-600">Chỉ số AQI</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-800">58</p>
                      <span className="rounded-full bg-lime-50 px-2.5 py-1 text-xs font-semibold text-lime-800">
                        Trung bình
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-green-100 py-4">
                    <span className="text-sm font-semibold text-slate-600">PM2.5 (mẫu)</span>
                    <span className="font-bold text-green-800">18 µg/m³</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tuyến thay thế ưu tiên không gian xanh và giả lập mức ô nhiễm thấp hơn.
                  </p>
                </article>
              </div>

              <div className="mt-6 rounded-2xl bg-green-900 p-6 text-white sm:p-8">
                <p className="text-sm font-semibold text-green-200">GỢI Ý DÀNH CHO BẠN</p>
                <h4 className="mt-2 text-2xl font-black">Di chuyển có ý thức, bắt đầu từ lựa chọn nhỏ</h4>
                <ul className="mt-5 space-y-3">
                  {safetyTips[userType].map((tip, index) => (
                    <li key={tip} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-300 text-xs font-black text-green-950">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-6 text-green-50">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Đây là prototype minh họa, không phải công cụ điều hướng hoặc tư vấn y tế. Hãy kiểm tra bản đồ và nguồn dữ liệu chất lượng không khí đáng tin cậy trước khi di chuyển.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              GreenWay hoạt động như thế nào?
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Một trải nghiệm đơn giản để người dùng hiểu rằng lựa chọn tuyến đường có thể liên quan đến nhiều yếu tố, không chỉ khoảng cách.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-100 bg-[#f7f9f5] p-7">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">📍</span>
              <p className="mt-6 text-sm font-bold text-green-700">BƯỚC 01</p>
              <h3 className="mt-2 text-xl font-extrabold">Nhập hành trình</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Cung cấp điểm đi, điểm đến, thời gian khởi hành và nhu cầu di chuyển của bạn.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-100 bg-[#f7f9f5] p-7">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-2xl">📊</span>
              <p className="mt-6 text-sm font-bold text-green-700">BƯỚC 02</p>
              <h3 className="mt-2 text-xl font-extrabold">So sánh lựa chọn</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Prototype trình bày cách so sánh khoảng cách, thời gian và các chỉ số chất lượng không khí minh họa.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-100 bg-[#f7f9f5] p-7">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">🌱</span>
              <p className="mt-6 text-sm font-bold text-green-700">BƯỚC 03</p>
              <h3 className="mt-2 text-xl font-extrabold">Chọn có ý thức</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Tham khảo gợi ý theo nhu cầu và kiểm tra thông tin thực tế trước khi bắt đầu hành trình.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="bg-green-950 px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="text-lg font-extrabold">GreenWay</span>
            </div>
            <p className="mt-2 text-sm text-green-200">
              Rethinking routes for a greener journey.
            </p>
          </div>
          <div className="text-sm leading-6 text-green-200 sm:max-w-md sm:text-right">
            Student prototype · Demo data only
            <br />
            Built to explore the connection between mobility and air quality.
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-green-300">
           © 2026 GreenWay. Prototype for educational purposes.
        </div>
      </footer>
    </main>
  );
}

