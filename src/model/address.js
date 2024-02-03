export class Address {
  
  constructor(
    city,
    state,
    zipCode,
    country,
    institution,
    campus
  ) {
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
    this.institution = institution;
    this.campus = campus;
  }

  get city() {
    return this.citu;
  }

  set city(value) {
    this.city = value;
  }
}