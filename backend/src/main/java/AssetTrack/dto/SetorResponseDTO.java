package AssetTrack.dto;

import AssetTrack.model.Setor;
import java.util.UUID;

public record SetorResponseDTO(
        UUID idSetor,
        String nomeSetor,
        String localizacaoFisica,
        int totalEquipamentos
) {
    public SetorResponseDTO(Setor setor) {
        this(
                setor.getIdSetor(),
                setor.getNomeSetor(),
                setor.getLocalizacaoFisica(),
                setor.getEquipamentos() != null ? setor.getEquipamentos().size() : 0
        );
    }
}