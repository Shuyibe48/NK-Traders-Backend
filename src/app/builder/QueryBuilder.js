class QueryBuilder {
  modelQuery;
  query;

  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search(searchableFields) {
  //   const searchTerm = this?.query?.searchTerm;
  //   if (searchTerm) {
  //     this.modelQuery = this.modelQuery.find({
  //       $or: searchableFields.map((field) => ({
  //         [field]: { $regex: searchTerm, $options: "i" },
  //       })),
  //     });
  //   }

  //   return this;
  // }

  search(searchableFields) {
    const searchTerm = this?.query?.searchTerm;

    // যদি সার্চ টার্ম থাকে, তাহলে শুধুমাত্র searchableFields-এর মধ্যে partial match করবো
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" }, // Case-insensitive partial match
        })),
      });
    }
    return this;
  }

  // filter() {
  //   const queryObj = { ...this.query };

  //   // নির্দিষ্ট ফিল্ডগুলো বাদ দিন
  //   const excludeFields = [
  //     "searchTerm",
  //     "sort",
  //     "limit",
  //     "page",
  //     "fields",
  //     "minPrice",
  //     "maxPrice",
  //   ];
  //   excludeFields.forEach((el) => delete queryObj[el]);

  //   // প্রাইস রেঞ্জ ফিল্টারিং
  //   if (this.query.minPrice || this.query.maxPrice) {
  //     queryObj.price = {}; // price এর জন্য অবজেক্ট শুরু করুন
  //     if (this.query.minPrice) {
  //       queryObj.price.$gte = Number(this.query.minPrice);
  //     }
  //     if (this.query.maxPrice) {
  //       queryObj.price.$lte = Number(this.query.maxPrice);
  //     }
  //   }

  //   // মাল্টিপল প্রপার্টি টাইপ ফিল্টারিং
  //   if (this.query.propertyType) {
  //     const propertyTypes = this.query.propertyType.split(",");

  //     // Ensure the values are trimmed and not empty
  //     queryObj.propertyType = { $in: propertyTypes.map(type => type.trim()) };
  //   }

  //   console.log("Query Object:", queryObj);

  //   // মডেল কুয়েরি তৈরি করুন
  //   this.modelQuery = this.modelQuery.find(queryObj);

  //   return this;
  // }

  // exactMatch(fields) {
  //   const exactMatchQuery = {};
  //   fields.forEach((field) => {
  //     if (this.query[field]) {
  //       // regex ব্যবহার করে location এর মধ্যে অংশিক ম্যাচ
  //       exactMatchQuery[field] = {
  //         $regex: this.query[field],
  //         $options: "i", // case-insensitive
  //       };
  //     }
  //   });

  //   if (Object.keys(exactMatchQuery).length > 0) {
  //     this.modelQuery = this.modelQuery.find(exactMatchQuery);
  //   }

  //   return this;
  // }

  // kaj kore
  filter() {
    const queryObj = { ...this.query };

    // নির্দিষ্ট ফিল্ডগুলো বাদ দিন
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "minPrice",
      "maxPrice",
      "minBedrooms",
      "maxBedrooms",
      "minBathrooms",
      "maxBathrooms",
      "minCarSpaces",
      "maxCarSpaces",
      "minLandSize",
      "maxLandSize",
      "availableAfter",
      "availableBefore",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    // প্রাইস রেঞ্জ ফিল্টারিং
    if (this.query.minPrice || this.query.maxPrice) {
      queryObj.price = {};
      if (this.query.minPrice)
        queryObj.price.$gte = Number(this.query.minPrice);
      if (this.query.maxPrice)
        queryObj.price.$lte = Number(this.query.maxPrice);
    }

    // Bedrooms ফিল্টারিং
    if (this.query.minBedrooms || this.query.maxBedrooms) {
      queryObj.bedrooms = {};
      if (this.query.minBedrooms)
        queryObj.bedrooms.$gte = Number(this.query.minBedrooms);
      if (this.query.maxBedrooms)
        queryObj.bedrooms.$lte = Number(this.query.maxBedrooms);
    }

    // Bathrooms ফিল্টারিং
    if (this.query.minBathrooms || this.query.maxBathrooms) {
      queryObj.bathrooms = {};
      if (this.query.minBathrooms)
        queryObj.bathrooms.$gte = Number(this.query.minBathrooms);
      if (this.query.maxBathrooms)
        queryObj.bathrooms.$lte = Number(this.query.maxBathrooms);
    }

    // Car Spaces ফিল্টারিং
    if (this.query.minCarSpaces || this.query.maxCarSpaces) {
      queryObj.carSpaces = {};
      if (this.query.minCarSpaces)
        queryObj.carSpaces.$gte = Number(this.query.minCarSpaces);
      if (this.query.maxCarSpaces)
        queryObj.carSpaces.$lte = Number(this.query.maxCarSpaces);
    }

    // Land Size ফিল্টারিং
    if (this.query.minLandSize || this.query.maxLandSize) {
      queryObj.landSize = {};
      if (this.query.minLandSize)
        queryObj.landSize.$gte = Number(this.query.minLandSize);
      if (this.query.maxLandSize)
        queryObj.landSize.$lte = Number(this.query.maxLandSize);
    }

    // New or Established Property ফিল্টারিং
    if (this.query.propertyAge) {
      queryObj.propertyAge = this.query.propertyAge;
    }

    // Sale Method ফিল্টারিং
    if (this.query.saleMethod) {
      const saleMethods = this.query.saleMethod
        .split(",")
        .map((method) => method.trim());
      queryObj.saleMethod = { $in: saleMethods };
    }

    // Available Date ফিল্টারিং
    if (this.query.availableAfter || this.query.availableBefore) {
      queryObj.availableDate = {};
      if (this.query.availableAfter)
        queryObj.availableDate.$gte = new Date(this.query.availableAfter);
      if (this.query.availableBefore)
        queryObj.availableDate.$lte = new Date(this.query.availableBefore);
    }

    // Keywords ফিল্টারিং (মাল্টিপল কিওয়ার্ডের জন্য)
    if (this.query.keywords) {
      const keywords = this.query.keywords
        .split(",")
        .map((word) => word.trim());
      queryObj.keywords = { $in: keywords };
    }

    // propertyRequirements ফিল্টারিং
    if (this.query.propertyRequirements) {
      const requirements = this.query.propertyRequirements
        .split(",")
        .map((req) => req.trim());
      queryObj.propertyRequirements = { $in: requirements };
    }

    // climateControlAndEnergy ফিল্টারিং
    if (this.query.climateControlAndEnergy) {
      const climateControl = this.query.climateControlAndEnergy
        .split(",")
        .map((ctrl) => ctrl.trim());
      queryObj.climateControlAndEnergy = { $in: climateControl };
    }

    // মাল্টিপল ফিল্ড ফিল্টারিং (যেমন propertyType, outdoorFeatures, etc.)
    const filterFields = [
      "propertyType",
      "outdoorFeatures",
      "indoorFeatures",
      "climateControlAndEnergy",
      "accessibilityFeatures",
      "propertyRequirements",
    ];


    filterFields.forEach((field) => {
      if (this.query[field]) {
        const values = this.query[field].split(",").map((item) => item.trim());
        queryObj[field] = { $in: values };
      }
    });


    console.log("Query Object:", queryObj);

    // কেস ইনসেন্সিটিভ সার্চের জন্য collation যুক্ত করা
    this.modelQuery = this.modelQuery
      .find(queryObj)
      .collation({ locale: "en", strength: 2 });

    return this;
  }

  // exactMatch(fields) {
  //   const exactMatchQuery = {};
  //   fields.forEach((field) => {
  //     if (field !== "propertyType" && this.query[field]) {
  //       exactMatchQuery[field] = {
  //         $regex: this.query[field],
  //         $options: "i",
  //       };
  //     }
  //   });

  //   if (Object.keys(exactMatchQuery).length > 0) {
  //     this.modelQuery = this.modelQuery.find(exactMatchQuery);
  //   }

  //   return this;
  // }

  exactMatch(fields) {
    const exactMatchQuery = {};
    const partialMatchQuery = {};

    // exact match শুধুমাত্র `type` ফিল্ডের জন্য
    if (this.query.type) {
      exactMatchQuery.type = this.query.type;
    }


    // `city` ফিল্ডের জন্য partial match এবং অন্যান্য ফিল্ডের জন্যও partial match
    fields.forEach((field) => {
      if (this.query[field]) {
        if (field === "city") {
          // `city` ফিল্ডের জন্য partial match
          partialMatchQuery[field] = {
            $regex: this.query[field],
            $options: "i", // case-insensitive
          };
        } else if (field !== "type") {
          // অন্যান্য ফিল্ডের জন্যও partial match
          partialMatchQuery[field] = {
            $regex: this.query[field],
            $options: "i",
          };
        }
      }
    });

    // exact match এবং partial match এর জন্য কুয়েরি যুক্ত করা
    if (Object.keys(exactMatchQuery).length > 0) {
      this.modelQuery = this.modelQuery.find(exactMatchQuery);
    }
    if (Object.keys(partialMatchQuery).length > 0) {
      this.modelQuery = this.modelQuery.find(partialMatchQuery);
    }

    return this;
  }

  sort() {
    const sort = this?.query?.sort?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields = this?.query?.fields?.split(",")?.join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
