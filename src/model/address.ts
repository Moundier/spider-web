export class Address {
  city: string;
  state: string;
  zipCode: string;
  country: string;
  institution: string;
  campus: string;

  constructor(
    city: string,
    state: string,
    zipCode: string,
    country: string,
    institution: string,
    campus: string
  ) {
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
    this.institution = institution;
    this.campus = campus;
  }
}
