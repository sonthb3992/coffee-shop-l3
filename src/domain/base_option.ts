abstract class OptionBase {
  abstract getName(): string | undefined;
  abstract getNameVi(): string | undefined;
  abstract getBasePrice(): number;
  abstract getCountPrice(count: number): number;
}
export { OptionBase };
