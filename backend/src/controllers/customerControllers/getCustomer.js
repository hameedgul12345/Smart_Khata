import Customer from '../../models/customerModel.js';

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
//    console.log(id)
    const customer = await Customer.findById({_id: id});

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
    // console.log(customer)
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customer',
      error: error.message,
    });
  }
};

export default getCustomer;
