import { Response, Request } from "express";
import { IContact } from "./type";
import ContactSchema from "./schema";
import { z } from "zod";

const parseBody = (bodyString: string) => {
  try {
    return JSON.parse(bodyString);
  } catch (e) {
    return bodyString;
  }
};

const getContact = async (req: Request, res: Response): Promise<void> => {
  try {
    let { query }: any = req.query;

    const contacts: IContact[] = await ContactSchema.find({
      $or: [
        { name: new RegExp(query || "") },
        { email: new RegExp(query || "") },
        { contact_no: new RegExp(query || "") },
      ],
    }).sort([["_id", -1]]);
    res.status(200).send({ data: contacts });
  } catch (error) {
    console.error({ error });
    res.status(500).send({ error });
  }
};

const addContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = parseBody(req.body);
    const _contactDetails = z
      .object({
        name: z.string().nonempty(),
        email: z.string().email(),
        contact_no: z.string().nonempty(),
        address: z.string().nonempty(),
      })
      .parse(body);

    const _newContact: IContact = new ContactSchema(_contactDetails);
    await _newContact.save();

    res.status(200).send({ mesage: "contact added sucessfully", data: [] });
  } catch (error) {
    if (error?.code && error.code == 11000) {
      res.status(422).send({ error: "Email already exist!" });
      return;
    }
    res.status(500).send({ error });
  }
};

const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = parseBody(req.body);

    const { _id, name, email, contact_no, address } = z
      .object({
        _id: z.string().nonempty(),
        name: z.string().nonempty(),
        email: z.string().email(),
        contact_no: z.string().nonempty(),
        address: z.string().nonempty(),
      })
      .parse(body);

    await ContactSchema.findByIdAndUpdate(
      { _id },
      { name, email, contact_no, address }
    );
    res.status(200).send({ mesage: "contact updated succesfully", data: [] });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = parseBody(req.body);

    const { _id } = z
      .object({
        _id: z.string().nonempty(),
      })
      .parse(body);

    await ContactSchema.findByIdAndRemove(_id);

    res.status(200).json({
      message: "contact deleted sucessfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export { getContact, addContact, updateContact, deleteContact };
