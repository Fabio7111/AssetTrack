package AssetTrack.dto;

import AssetTrack.model.ConfiguracaoSistema;
import java.util.UUID;

public record ConfiguracaoSistemaResponseDTO(
        UUID id,
        String nomeOrganizacao,
        String telefone,
        String emailSuporte,
        Boolean alertaBaixoEstoque,
        Boolean alertaDevolucaoAtrasada
) {

    public ConfiguracaoSistemaResponseDTO(ConfiguracaoSistema config) {
        this(
                config.getId(),
                config.getNomeOrganizacao(),
                config.getTelefone(),
                config.getEmailSuporte(),
                config.getAlertaBaixoEstoque() != null ? config.getAlertaBaixoEstoque() : false,
                config.getAlertaDevolucaoAtrasada() != null ? config.getAlertaDevolucaoAtrasada() : false
        );
    }
}