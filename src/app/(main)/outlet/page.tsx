import { redirect } from 'next/navigation';

export default function OutletPage() {
  redirect('/search?maxDiscount=20&sort=discount');
}
