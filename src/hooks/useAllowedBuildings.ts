import { appContext } from 'context/AppContext';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { useContext, useEffect, useState } from 'react';
import BuildingsService from 'services/api/buildings.service';

const useAllowedBuildings = () => {
  const [allowedBuildings, setAllowedBuildings] = useState<Array<BuildingResponse>>([]);
  const { loggedUser } = useContext(appContext);

  useEffect(() => {
    const buildingsService = new BuildingsService();
    const getAllowedBuildings = async () => {
      if (loggedUser) {
        if (loggedUser.is_admin) {
          buildingsService.list().then((response) => {
            setAllowedBuildings(response.data);
          });
        } else {
          setAllowedBuildings(loggedUser.buildings || []);
        }
      }
    };
    getAllowedBuildings();
  }, [loggedUser]);

  return { allowedBuildings };
};

export default useAllowedBuildings;
