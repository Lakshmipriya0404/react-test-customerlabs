import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DropDownData } from "../data";

interface DropdownOption {
  label: string;
  value: string;
}

interface Props {
  popup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidePopup: React.FC<Props> = ({ popup }) => {
  const { toast } = useToast();

  const [segmentName, setSegmentName] = useState("");
  const [dropdowns, setDropdowns] = useState<DropdownOption[][]>([[]]);
  const [selectedValues, setSelectedValues] = useState<string[][]>([[]]);

  const addNewDropdown = () => {
    const newDropdowns = [...dropdowns, []];
    setDropdowns(newDropdowns);
    setSelectedValues([...selectedValues, []]);
  };

  const handleOptionSelect = (dropdownIndex: number, value: string) => {
    setSelectedValues((prevSelectedValues) => {
      const newSelectedValues = [...prevSelectedValues];
      newSelectedValues[dropdownIndex] = [value];
      return newSelectedValues;
    });
  };

  const getSelectedLabel = (dropdownIndex: number) => {
    const selectedValue = selectedValues[dropdownIndex][0];
    const correspondingOption = DropDownData.find(
      (option) => option.value === selectedValue
    );
    return correspondingOption ? correspondingOption.label : "";
  };

  const availableOptions = (index: number) =>
    DropDownData.filter(
      (option) =>
        !selectedValues.some(
          (selected, i) => i !== index && selected.includes(option.value)
        )
    );

  // functionality to remove dropdown
  const handleMinusClick = (index: number) => {
    setDropdowns((prevDropdowns) => {
      const newDropdowns = [...prevDropdowns];
      newDropdowns.splice(index, 1);
      return newDropdowns;
    });

    setSelectedValues((prevSelectedValues) => {
      const newSelectedValues = [...prevSelectedValues];
      newSelectedValues.splice(index, 1);
      return newSelectedValues;
    });
  };

  // functionality to save the segment
  const handleSaveSegment = () => {
    const schema = dropdowns
      .map((_, index) => {
        const selectedValue = selectedValues[index][0];
        const correspondingOption = DropDownData.find(
          (option) => option.value === selectedValue
        );
        return correspondingOption
          ? { [selectedValue]: correspondingOption.label }
          : null;
      })
      .filter(Boolean);

    if (segmentName == "") {
      toast({
        variant: "destructive",
        title: "Please enter the name of the segment",
      });
    } else if (schema == null) {
      console.log(schema[0]);
      toast({
        variant: "destructive",
        title: "Please add atleast one schema",
      });
    } else {
      const data = {
        segment_name: segmentName,
        schema: schema,
      };
      axios
        .post(
          "	https://webhook.site/5ae53a90-3a18-46d5-b401-d2d06f6c0dd1",
          JSON.stringify(data)
        )
        .then(() => {
          console.log("Success");
        })
        .catch((err) => {
          console.log(err);
        });
      toast({
        description: "Your data has been sent.",
        variant: "default",
      });
    }
  };

  const handleCancel = () => {
    setDropdowns([[]]);
    setSelectedValues([[]]);
    popup(false);
  };

  return (
    <div className="relative">
      <Navbar title="Saving Segment" />
      <div className="mt-10 pb-20 p-5">
        <h2 className="pb-5">Enter the Name of the Segment</h2>
        <Input
          placeholder="Name of the segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />
        <h2 className="pt-5 pb-5">
          To save your segment, you need to add the schemas
          <br />
          to build the query
        </h2>
        <div className="flex justify-end mb-5">
          <div className="flex items-center mr-4">
            <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
            <span>-User Traits</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
            <span>-Group Traits</span>
          </div>
        </div>
        {dropdowns.map((_, index) => (
          <div key={index} className="flex items-center pt-2 pb-3">
            <Select onValueChange={(value) => handleOptionSelect(index, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add schema to segment">
                  {getSelectedLabel(index)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="relative bg-white z-1000">
                <SelectGroup>
                  <SelectLabel>Add schema to segment</SelectLabel>
                  {availableOptions(index).map((option, i) => (
                    <SelectItem key={i} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="ml-5"
              onClick={() => handleMinusClick(index)}
            >
              <Minus className="h-6 w-6" />
            </Button>
          </div>
        ))}
        <Button variant="link" onClick={addNewDropdown}>
          +Add new schema
        </Button>
      </div>
      <div className="fixed bottom-0 right-0 w-1/2 bg-gray-200 p-5">
        <Button
          variant="default"
          className="bg-savebtn-color ml-2"
          onClick={handleSaveSegment}
        >
          Save the Segment
        </Button>
        <Button
          variant="default"
          className="bg-white text-red-700 ml-5"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SidePopup;
