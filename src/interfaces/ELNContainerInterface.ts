export default interface ELNContainerInterface {
  name: string;
  children: any[];
  attachments: any[];
  is_deleted: boolean;
  description: string;
  extended_metadata: {
    report: boolean;
  };
  container_type: string;
}
