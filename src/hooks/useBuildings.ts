import useCustomToast from 'hooks/useCustomToast';
import {
  CreateBuilding,
  UpdateBuilding,
} from 'models/http/requests/building.request.models';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { useCallback, useEffect, useState } from 'react';
import { sortBuildingsResponse } from 'utils/buildings/building.sorter';
import useBuildingsService from './API/services/useBuildingsService';

const useBuildings = (initialFetch = true) => {
  const service = useBuildingsService();
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);

  const showToast = useCustomToast();

  const getAllBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setBuildings(response.data.sort(sortBuildingsResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar prédios', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const getBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .getMyBuildings()
      .then((response) => {
        setBuildings(response.data.sort(sortBuildingsResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar prédios', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service]);

  const createBuilding = useCallback(
    async (data: CreateBuilding) => {
      setLoading(true);
      await service
        .create(data)
        .then((response) => {
          showToast(
            'Sucesso',
            `Prédio ${data.name} criado com sucesso!`,
            'success',
          );
          getBuildings();
        })
        .catch((error) => {
          showToast('Erro', `Erro ao criar prédio: ${error}`, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service],
  );

  const updateBuilding = useCallback(
    async (id: number, data: UpdateBuilding) => {
      setLoading(true);
      await service
        .update(id, data)
        .then((response) => {
          showToast('Sucesso', `Prédio atualizado com sucesso!`, 'success');
          getBuildings();
        })
        .catch((error) => {
          showToast(
            'Erro',
            `Erro ao atualizar o prédio ${data.name}: ${error}`,
            'error',
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service],
  );

  const deleteBuilding = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then((response) => {
          showToast('Sucesso!', 'Sucesso ao remover prédio', 'success');

          getBuildings();
        })
        .catch((error) => {
          showToast('Erro!', 'Erro ao remover prédio', 'error');
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service],
  );

  useEffect(() => {
    if (initialFetch) getBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    buildings,
    getBuildings,
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
  };
};

export default useBuildings;
