import React, {useContext, useEffect, useState} from "react";
import {Premise} from "packages/api";
import {handleResult} from "packages/core";
import {PremiseServiceContext} from "./premiseService";
import {BackButton} from "../../../components/backButton/backButton";
import {ItemColumnSpec, ItemManagementTable} from "../../../components/itemManagementTable";
import { AddIcon } from "../../../components/icons/AddIcon";
import Swal from "sweetalert2";

const premiseColSpecs: ItemColumnSpec<Premise>[] = [
  { title: 'Address', valueFunc: (premise) => premise.address},
  { title: 'City', valueFunc: (premise) => premise.city },
  { title: 'State', valueFunc: (premise) => premise.state.name },
  { title: 'Postal Code', valueFunc: (premise) => premise.postcode },
  { title: 'Country', valueFunc: (premise) => premise.country },
]

const showFeatureNotAvailable = async () => {
  await Swal.fire({
    title: "Not Implemented",
    text: "The feature you are trying to invoke has not yet been implemented.",
    icon: "warning",
    confirmButtonText: "OK",
  });
  return;
}

const addPremise = async () => {
  await showFeatureNotAvailable()
}

const editPremise = async (premiseId: string) => {
  await showFeatureNotAvailable()
}

const removePremise = async (premiseId: string) => {
  await showFeatureNotAvailable()
}

const ManagePremises: React.FC = () => {

  const premiseService = useContext(PremiseServiceContext)

  const [premises, setPremises] = useState<Premise[]>([]);

  useEffect(() => {
    const premisesSub = premiseService.premise$()
      .subscribe(next => {
        handleResult(next, {
          success: (data) => { setPremises(data) },
          error: (error) => {}
        })
      })
    return () => {
      premisesSub.unsubscribe();
    }
  }, [])

  return (
    <>
      <div className="container">
        <div className="manage-premises-top-section">
          <BackButton />
          <h2>Manage Premises</h2>
          <div className="button-group">
            <button
              id="add-premise-btn"
              className="standard-icon-button"
              onClick={addPremise}>
              <AddIcon/>
            </button>
          </div>
        </div>
        <ItemManagementTable<Premise>
          colSpecs={premiseColSpecs}
          items={premises}
          itemKey={(premise) => premise.id}
          editItem={(premise) => editPremise(premise.id)}
          removeItem={(premise) => removePremise(premise.id)}
        />
      </div>
    </>
  )
}

export default ManagePremises
