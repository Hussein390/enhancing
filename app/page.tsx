import { Enhance } from './enhance';
import { getYears } from './server'
export default async function Home() {

  const years = await getYears();
  return (
    <Enhance years={years!} />
  );
}
