import { appContext } from '../context/AppContext';
import { BuildingResponse } from '../models/http/responses/building.response.models';
import { useContext, useEffect, useState } from 'react';
import { sortBuildingsResponse } from '../utils/buildings/building.sorter';
import useBuildingsService from './API/services/useBuildingsService';
import useCustomToast from './useCustomToast';
import BuildingErrorParser from './buildingErrorParser';
import { filterBuildings } from '../utils/access/access';
import { ClassroomAction } from '../utils/enums/actions.enums';

// The buildings where the user can allocate: GET /users/my-buildings (the
// buildings the user belongs to) narrowed to those with ALLOCATE on the
// building or on one of its classrooms.
const useAllowedBuildings = () => {
  const buildingsService = useBuildingsService();
  const [loading, setLoading] = useState(false);
  const [allowedBuildings, setAllowedBuildings] = useState<
    Array<BuildingResponse>
  >([]);
  const { loggedUser, access } = useContext(appContext);
  const showToast = useCustomToast();
  const parser = new BuildingErrorParser();

  useEffect(() => {
    const getAllowedBuildings = async () => {
      if (!loggedUser) return;
      setLoading(true);
      try {
        const response = await buildingsService.getMyBuildings();
        setAllowedBuildings(
          filterBuildings(access, ClassroomAction.ALLOCATE, response.data).sort(
            sortBuildingsResponse,
          ),
        );
      } catch (error) {
        showToast('Erro', parser.parseGetError(error), 'error');
      } finally {
        setLoading(false);
      }
    };
    getAllowedBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, access]);

  return { allowedBuildings, loading };
};

export default useAllowedBuildings;
