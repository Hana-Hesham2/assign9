

export const create = async({model,data}={})=>{
    return await model.create(data)
}

export const findOne = async({model ,filter ={} , options={}}={})=>{
    const doc =model.findOne(filter)
    if (options.populate){
        doc.populate(options.populate)

    }if (options.skip){
        doc.skip(options.skip)

    }if (options.limit){
        doc.limit(options.limit)
    }
    return await doc.exec()
}

export const find = async({model ,filter ={} , options={}}={})=>{
    const doc =model.find(filter)
    if (options.populate){
        doc.populate(options.populate)

    }if (options.skip){
        doc.skip(options.skip)

    }if (options.limit){
        doc.limit(options.limit)
    }
    return await doc.exec()
}

export const updateOne = async({model ,filter ={} , update={},options={}}={})=>{
    const doc =model.updateOne(filter,update,{runValidators:true,...options})
    return await doc.exec()
}

export const findOneAndUpdate = async ({ model, filter = {}, update = {}, options = {} } = {}) => {
  const doc = await model.findOneAndUpdate(
    filter,
    update,
    { new: true, runValidators: true, ...options }
  );
  return doc;
};


export const findById = async ({ model, id, select = "" }) => {
  try {
    if (!model) throw new Error("Model is required");
    if (!id) throw new Error("ID is required");

    const user = await model.findById(id).select(select);

    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async ({ model, filter = {} }) => {
    return await model.deleteOne(filter)
  };

export const deleteMany = async ({ model, filter = {} }) => {
    return await model.deleteMany(filter)
  };