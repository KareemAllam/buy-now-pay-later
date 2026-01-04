export function calculateMonthlyPayment(totalAmount: number, installmentCount: number): number {
  return Math.round(totalAmount / installmentCount);
}