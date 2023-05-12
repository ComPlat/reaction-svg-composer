interface MoleculeInterface {
  label: string;
  value: number;
  desc: string;
  mid: number;
}
export function isMolecule(molecule: any): molecule is MoleculeInterface {
  return (molecule as MoleculeInterface).label !== undefined;
}
export default MoleculeInterface;
