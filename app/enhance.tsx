'use client'
import { useEffect, useState } from "react";
import { createDay, getDays, getMonths } from "./server";

type year = {
  id: string,
  years: number
}
type month = {
  id: string;
  MonthName: string;
  yearsId: string | null;
}
type days = {
  postion: number;
  isTrue: boolean;
  monthId: string | null;
}

type Enhances = {
  years: year[]
}
export default function Enhance({ years }: Enhances) {
  const boxs = Array.from({ length: 30 }, (_, i) => i + 1);
  const [months, setMonths] = useState<month[]>([]);
  const [days, setDays] = useState<days[]>([]);
  const [isYears, setIsYears] = useState(false);
  const [isMonths, setIsMonths] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(Array(boxs.length).fill(false));
  let sccessed: number = 0;
  let failed: number = 0;

  ////
  let StoreYear: string | null = null;
  let StoreMonth: string | null = null;
  let StoreYearId: string | null = null;
  let StoreMonthId: string | null = null;

  if (typeof window !== 'undefined') {
    StoreYear = localStorage.getItem('year');
    StoreMonth = localStorage.getItem('month');
    StoreYearId = localStorage.getItem('yearId');
    StoreMonthId = localStorage.getItem('monthId');
  }
  useEffect(() => {
    fetchALl()
  }, [])

  async function fetchALl() {
    const month: month[] = await getMonths(StoreYearId!) || [];
    setMonths(month);
    const day: days[] = await getDays(StoreMonthId!) || [];
    setDays(day);
  }

  function box(index: number) {
    const newIsBoxOpen = [...isBoxOpen];
    newIsBoxOpen[index] = !newIsBoxOpen[index];
    setIsBoxOpen(newIsBoxOpen);
  }
  function getResults(e: string, id: number) {
    const result = document.getElementById(`${id}`);
    if (e === 'm') {
      result!.textContent = 'M';
      result?.classList.remove('text-green-500');
      result?.classList.add('text-red-500');
      createDay(false, StoreMonthId!, id);
    }
    else if (e === 'p') {
      result!.textContent = 'P';
      result?.classList.remove('text-red-500');
      result?.classList.add('text-green-500');
      createDay(true, StoreMonthId!, id);
    }
    document.getElementById(`div-${id}`)?.classList.add('pointer-events-none');
  }

  async function fetchYears(item: { id: string, years: number }) {
    const data: month[] = await getMonths(item.id) || [];
    setMonths(data!);
    setIsMonths(prev => !prev);
    document.getElementById('year')!.textContent = String(item.years);
    localStorage.setItem('year', String(item.years));
    localStorage.setItem('yearId', String(item.id));
  }

  async function fetchMonths(item: { id: string, MonthName: string }) {
    const data: days[] = await getDays(item.id) || [];
    setDays(data!)
    setIsMonths(prev => !prev)
    document.getElementById('month')!.textContent = item.MonthName;
    localStorage.setItem('month', item.MonthName)
    localStorage.setItem('monthId', item.id)
  }

  days.forEach(item => {
    if (item.isTrue) sccessed++;
    else failed++;
  })

  return (
    <div className="relative w-[380px] mx-auto p-3 select-none">
      <h1 className="text-4xl  text-center font-semibold">This is <span className="text-blue-500">{new Date().getFullYear()}</span> Dude</h1>
      <p className="text-slate-400 text-center mt-1">Do not wish it was easier, wish you were better </p>
      <p className="text-slate-400 text-center mt-1">It is time to enhance, does not it!</p>

      <div className=" w-[200px] mx-auto mt-4">
        <div className="flex justify-between">
          <span className="text-green-500 font-semibold">Sccessed: {sccessed ?? 0}</span>
          <span className="text-red-500 font-semibold">Failed: {failed ?? 0}</span>
        </div>

        <div className="mt-2">
          <span className="bg-green-500 h-1 block rounded-md" style={{ width: (sccessed / 30) * 100 }}></span>
          <span className="bg-red-500 h-1 block mt-2 rounded-md" style={{ width: (failed / 30) * 100 }}></span>
        </div>
      </div>
      <div className="relative bg-white w-[200px] border border-black cursor-pointer p-3 rounded mx-auto my-5 flex justify-between items-center" onClick={() => setIsYears(prev => !prev)}>
        <div className="flex gap-x-1 font-semibold"><span id="month">{StoreMonth ?? 'October'}</span> . <span id="year">{StoreYear ?? '2024'}</span></div>
        <span className="font-bold text-xl">↓</span>
        <div className={`${isYears ? 'flex' : 'hidden'} bg-white absolute -bottom-48 z-30 left-0 w-full  flex-col gap-y-2 border`}>
          {years.map(item => (
            <button key={item.id} className="p-2 hover:bg-blue-500 bg-slate-300 hover:text-white" onClick={() => fetchYears(item)}>{item.years}</button>
          ))}
        </div>
      </div>
      <div className={`${isMonths ? 'flex' : 'hidden'} w-[200px] mx-auto  bg-white absolute top-[230px] z-30 left-[90px] flex-col gap-y-2 border p-2 rounded`}>
        {months.map(item => (
          <button key={item.id} className="px-2 py-1 rounded text-sm hover:bg-blue-500 bg-slate-300 hover:text-white" onClick={() => fetchMonths(item)}>{item.MonthName}</button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {boxs.map((item) => {
          const day = days.find(day => day.postion === item)
          return (
            < div id={`div-${item}`} key={item} onClick={() => box(item)} className={`${day?.isTrue == true ? 'pointer-events-none' : day?.isTrue == false ? 'pointer-events-none' : ''} cursor-pointer relative`}>
              <h1>{item}</h1>
              <button id={`${item}`} className={`${day?.isTrue ? 'text-green-500' : 'text-red-500'} border bg-transparent size-8 border-black`}>
                {day?.isTrue === true ? 'P' : day?.isTrue === false ? 'M' : ''}
              </button>
              <div className={`${isBoxOpen[item] ? 'flex' : 'hidden'} absolute top-0 left-0 gap-x-1`}>
                <button className="bg-green-400 text-white text-sm p-1 px-2 rounded" onClick={() => getResults('p', item)}>P</button>
                <button className="bg-red-400 text-white text-sm p-1 px-2 rounded" onClick={() => getResults('m', item)}>M</button>
              </div>
            </div>
          )
        })}

      </div>
    </div >
  );
}
