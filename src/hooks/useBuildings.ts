import useCustomToast from 'hooks/useCustomToast';
import { CreateBuilding, UpdateBuilding } from 'models/common/building.model';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { useCallback, useEffect, useState } from 'react';
import BuildingsService from 'services/api/buildings.service';
import { sortBuildingsResponse } from 'utils/buildings/building.sorter';

const service = new BuildingsService();

const useBuildings = () => {
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);

  const showToast = useCustomToast();

  const getBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .list()
      .then((response) => {
        setBuildings(response.data.sort(sortBuildingsResponse));
      })
      .catch((error) => {
        showToast('Erro', 'Erro ao carregar prédios', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast]);

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
    [getBuildings, showToast],
  );

  const updateBuilding = useCallback(async (id: number, data: UpdateBuilding) => {
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
  }, [getBuildings, showToast]);

  const deleteBuilding = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .delete(id)
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
    [getBuildings, showToast],
  );

  useEffect(() => {
    getBuildings();
  }, [getBuildings]);

  return {
    loading,
    buildings,
    getBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
  };
};

export default useBuildings;
