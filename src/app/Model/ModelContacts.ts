import { ContactPost } from "./ModelContactPost";
import { Organizations} from "./ModelOrganizations";

export class Contacts {
  contact_id: any;
  name: any;
  phone: any;
  email: any;
  position: any;
  organization: Organizations  | undefined;
  contactPost: ContactPost | undefined;

}
