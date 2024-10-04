'use server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function getYears() {
  try {
    const years = await prisma.years.findMany();
    return years
  } catch (err) {
    console.log(err)
  }
}
export async function getMonths(yearsId: string) {
  try {
    const months = await prisma.months.findMany({where:{yearsId}});
    return months
  } catch (err) {
    console.log(err)
  }
}
export async function getDays(monthId: string) {
  try {
    const days = await prisma.days.findMany({where:{monthId}});
    return days
  } catch (err) {
    console.log(err)
  }
}
export async function createDay( isTrue: boolean, monthId: string, postion: number) {
  try {
    const newDay = await prisma.days.create({
      data: {
        isTrue,
        monthId,
        postion
      }
    });
    return newDay
  } catch (err) {
    console.log(err)
  }
}

